import { HistogramAccumulator } from '../src/histogram-accumulator';

import { expect } from 'chai';
import 'mocha';

const percentiles = {
	id: 'test-spec',
	list: [
		{ p: 0.5, x: 30 },
		{ p: 0.9, x: 100 },
		{ p: 0.95, x: 200 }
	]
};

// NOTE: if the code between histAccum.start() and the end of your 
// code which sets up the expected state for onWindowEnd callback takes 
// longer than a 100 ms, not only will this test fail, you are probably 
// using a potato as your test machine
const t = 0.1;

describe('HistogramAccumulator', () => {

	it('should callback with histogram after the window elapsed', (done) => {
		new Promise((resolve, reject) => {
			// set up the histogram
			const histAccum = new HistogramAccumulator(t, percentiles);
			// start the timing window
			histAccum.start();
			// bin 0
			histAccum.addSamplePoint(3);
			// bin 1
			histAccum.addSamplePoint(32);
			histAccum.addSamplePoint(99);
			// bin 2
			histAccum.addSamplePoint(100);
			histAccum.addSamplePoint(150);
			histAccum.addSamplePoint(199);
			// bin 3
			histAccum.addSamplePoint(200);
			histAccum.addSamplePoint(300);
			histAccum.addSamplePoint(1000);
			histAccum.addSamplePoint(30000);
			// add callback and expect it to be called
			histAccum.emitter.on('histogram', (hist) => {
				// check hist is the one we expect
				expect(hist.bins[0]).to.equal(1);
				expect(hist.bins[1]).to.equal(2);
				expect(hist.bins[2]).to.equal(3);
				expect(hist.bins[3]).to.equal(4);
				histAccum.stop();
				resolve();
			});
			setTimeout(() => {
				reject(new Error('callback not called after time window'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

	it('should clear properly', () => {
		const histAccum = new HistogramAccumulator(
				100000, percentiles);
		histAccum.addSamplePoint(3);
		histAccum.clear();
		expect(histAccum.hist.total).to.equal(0);
		expect(histAccum.hist.bins[0]).to.equal(0);
	});

	it('should clear after the window elapsed', (done) => {
		new Promise((resolve, reject) => {
			const histAccum = new HistogramAccumulator(t, percentiles);
			histAccum.start();
			histAccum.addSamplePoint(3);
			histAccum.emitter.on('histogram', (hist) => {
				expect(histAccum.hist.total).to.equal(0);
				expect(histAccum.hist.bins[0]).to.equal(0);
				// NOTE: we have to stop it here, or else this will run again
				// and break mocha's mind!
				histAccum.stop();
				resolve();
			});
			setTimeout(() => {
				reject(new Error('callback not called after time window'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

	it('should stop properly', (done) => {
		new Promise((resolve, reject) => {
			const histAccum = new HistogramAccumulator(t, percentiles);
			histAccum.start();
			histAccum.addSamplePoint(3);
			histAccum.stop();
			histAccum.emitter.on('histogram', () => {
				reject(new Error('histAccum callback was called despite .stop()'));
				// NOTE: we have to stop it here, or else this will run again
				// and break mocha's mind!
				histAccum.stop();
			});
			setTimeout(resolve, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

});
