import { PercentileHistogramAccumulator } from '../src/percentile-histogram-accumulator';
import { PercentileReactor } from '../src/percentile-reactor';

import { expect } from 'chai';
import 'mocha';

const percentiles = {
	id: 'test-spec',
	list: [
		{ p: 0.9, x: 100 },
	]
};

// NOTE: if the code between pHistAccum.start() and the end of your 
// code which sets up the expected state for onWindowEnd callback takes 
// longer than a 100 ms, not only will this test fail, you are probably 
// using a potato as your test machine
const t = 0.1;

describe('PercentileReactor', () => {

	it('should fail a failing percentile', (done) => {
		new Promise((resolve, reject) => {
			let pHistAccum = new PercentileHistogramAccumulator(t, percentiles);
			let pReactor = new PercentileReactor(percentiles);
			pHistAccum.start();
			for (let i = 0; i < 20; i++) {
				pHistAccum.addSamplePoint(101);
			}
			for (let i = 0; i < 80; i++) {
				pHistAccum.addSamplePoint(99);
			}
			pHistAccum.onWindowEnd((hist) => {
				pReactor.reactToHistogram(hist);
				pHistAccum.stop();
			});
			pReactor.addFailReaction(percentiles.list[0].p, () => {
				resolve();
			});
			setTimeout(() => {
				reject(new Error('failed to call fail callback'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});
		

	it('should pass a passing percentile', (done) => {
		new Promise((resolve, reject) => {
			let pHistAccum = new PercentileHistogramAccumulator(t, percentiles);
			let pReactor = new PercentileReactor(percentiles);
			pHistAccum.start();
			for (let i = 0; i < 5; i++) {
				pHistAccum.addSamplePoint(101);
			}
			for (let i = 0; i < 95; i++) {
				pHistAccum.addSamplePoint(99);
			}
			pHistAccum.onWindowEnd((hist) => {
				pReactor.reactToHistogram(hist);
				pHistAccum.stop();
			});
			pReactor.addPassReaction(percentiles.list[0].p, () => {
				resolve();
			});
			setTimeout(() => {
				reject(new Error('failed to call pass callback'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

});
