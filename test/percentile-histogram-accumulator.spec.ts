import { PercentileHistogramAccumulator } from '../src/percentile-histogram-accumulator';

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

// NOTE: if the code between pHistAccum.start() and the end of your 
// code which sets up the expected state for onWindowEnd callback takes 
// longer than a 100 ms, not only will this test fail, you are probably 
// using a potato as your test machine
const t = 0.1;

describe('PercentileHistogramAccumulator', () => {

	it('should callback with histogram after the window elapsed', (done) => {
		new Promise((resolve, reject) => {
			// set up the histogram
			const pHistAccum = new PercentileHistogramAccumulator(t, percentiles);
			// start the timing window
			pHistAccum.start();
			// bin 0
			pHistAccum.addSamplePoint(3);
			// bin 1
			pHistAccum.addSamplePoint(32);
			pHistAccum.addSamplePoint(99);
			// bin 2
			pHistAccum.addSamplePoint(100);
			pHistAccum.addSamplePoint(150);
			pHistAccum.addSamplePoint(199);
			// bin 3
			pHistAccum.addSamplePoint(200);
			pHistAccum.addSamplePoint(300);
			pHistAccum.addSamplePoint(1000);
			pHistAccum.addSamplePoint(30000);
			// add callback and expect it to be called
			pHistAccum.onWindowEnd((hist) => {
				// check hist is the one we expect
				expect(hist.bins[0]).to.equal(1);
				expect(hist.bins[1]).to.equal(2);
				expect(hist.bins[2]).to.equal(3);
				expect(hist.bins[3]).to.equal(4);
				pHistAccum.stop();
				resolve();
			});
			setTimeout(() => {
				reject(new Error('callback not called after time window'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

	it('should clear properly', () => {
		const pHistAccum = new PercentileHistogramAccumulator(
				100000, percentiles);
		pHistAccum.addSamplePoint(3);
		pHistAccum.clear();
		expect(pHistAccum.hist.total).to.equal(0);
		expect(pHistAccum.hist.bins[0]).to.equal(0);
	});

	it('should clear after the window elapsed', (done) => {
		new Promise((resolve, reject) => {
			const pHistAccum = new PercentileHistogramAccumulator(t, percentiles);
			pHistAccum.start();
			pHistAccum.addSamplePoint(3);
			pHistAccum.onWindowEnd((hist) => {
				expect(pHistAccum.hist.total).to.equal(0);
				expect(pHistAccum.hist.bins[0]).to.equal(0);
				// NOTE: we have to stop it here, or else this will run again
				// and break mocha's mind!
				pHistAccum.stop();
				resolve();
			});
			setTimeout(() => {
				reject(new Error('callback not called after time window'));
			}, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

	it('should stop properly', (done) => {
		new Promise((resolve, reject) => {
			const pHistAccum = new PercentileHistogramAccumulator(t, percentiles);
			pHistAccum.start();
			pHistAccum.addSamplePoint(3);
			pHistAccum.stop();
			pHistAccum.onWindowEnd(() => {
				reject(new Error('pHistAccum callback was called despite .stop()'));
				// NOTE: we have to stop it here, or else this will run again
				// and break mocha's mind!
				pHistAccum.stop();
			});
			setTimeout(resolve, t * 1.5 * 1000);
		}).then(done).catch(done);
	});

});
