import { Histogram } from '../src/histogram';
import { HistogramAccumulator } from '../src/histogram-accumulator';
import { PercentileSpec } from '../src/percentile-spec';
import { SLOReactor } from '../src/slo-reactor';

import { expect } from 'chai';
import 'mocha';

const percentiles = new PercentileSpec(
	'test-spec',
	[
		{ p: 0.9, x: 100 },
	]
);

// NOTE: if the code between histAccum.start() and the end of your 
// code which sets up the expected state for onWindowEnd callback takes 
// longer than a 100 ms, not only will this test fail, you are probably 
// using a potato as your test machine
const t = 0.1;

describe('SLOReactor', () => {

	it('should fail a failing distribution', (done) => {
		new Promise((resolve, reject) => {
			let histAccum = new HistogramAccumulator(t, percentiles);
			let sloReactor = new SLOReactor(percentiles);
			histAccum.start();
			for (let i = 0; i < 20; i++) {
				histAccum.addSamplePoint(101);
			}
			for (let i = 0; i < 80; i++) {
				histAccum.addSamplePoint(99);
			}
			histAccum.emitter.on('histogram', (hist) => {
				sloReactor.reactTo(hist);
				histAccum.stop();
			});
			sloReactor.addFailReaction(percentiles.list[0].p, () => {
				resolve();
			});
			setTimeout(() => {
				reject(new Error('failed to call fail callback'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});
		
	it('should pass a passing distribution', (done) => {
		new Promise((resolve, reject) => {
			let histAccum = new HistogramAccumulator(t, percentiles);
			let sloReactor = new SLOReactor(percentiles);
			histAccum.start();
			for (let i = 0; i < 5; i++) {
				histAccum.addSamplePoint(101);
			}
			for (let i = 0; i < 95; i++) {
				histAccum.addSamplePoint(99);
			}
			histAccum.emitter.on('histogram', (hist) => {
				sloReactor.reactTo(hist);
				histAccum.stop();
			});
			sloReactor.addPassReaction(percentiles.list[0].p, () => {
				resolve();
			});
			setTimeout(() => {
				reject(new Error('failed to call pass callback'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

	it('should pass an empty distribution', (done) => {
		new Promise((resolve, reject) => {
			let histAccum = new HistogramAccumulator(t, percentiles);
			let sloReactor = new SLOReactor(percentiles);
			histAccum.start();
			histAccum.emitter.on('histogram', (hist) => {
				sloReactor.reactTo(hist);
				histAccum.stop();
			});
			sloReactor.addPassReaction(percentiles.list[0].p, () => {
				resolve();
			});
			setTimeout(() => {
				reject(new Error('failed to call pass callback'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

	it('should throw error if percentile spec different', () => {
		try {
			let sloReactor = new SLOReactor(percentiles);
			let otherPercentiles = new PercentileSpec(
				'other',
				[
					{ p: 0.9, x: 50 }
				]
			);
			let hist = new Histogram(otherPercentiles);
			sloReactor.reactTo(hist);
			throw new Error('did not throw error when reacting to histogram ' +
				'constructed with different PercentileSpec');
		} catch (err) {
			// this should happen
		}
	});

});
