import { Histogram, PercentileSpec } from '../src';

import { expect } from 'chai';
import 'mocha';

const percentiles = new PercentileSpec(
	'test-spec',
	[
		{ p: 0.5, x: 30 },
		{ p: 0.9, x: 100 },
		{ p: 0.95, x: 200 }
	]
);

describe('Histogram', () => {

	it('should add data points to the right bins', () => {
		const hist = new Histogram(percentiles);
		// add sample points and check which bins they fall in
		hist.recordValue(3);
		expect(hist.bins[0]).to.equal(1);
		hist.recordValue(32);
		hist.recordValue(99);
		expect(hist.bins[1]).to.equal(2);
		hist.recordValue(100);
		hist.recordValue(150);
		hist.recordValue(199);
		expect(hist.bins[2]).to.equal(3);
		hist.recordValue(200);
		hist.recordValue(300);
		hist.recordValue(1000);
		hist.recordValue(30000);
		expect(hist.bins[3]).to.equal(4);
	});

	it('should make cumulative properly', () => {
		let hist = new Histogram(percentiles);
		// bin 0
		hist.recordValue(3);
		// bin 1
		hist.recordValue(32);
		hist.recordValue(99);
		// bin 2
		hist.recordValue(100);
		hist.recordValue(150);
		hist.recordValue(199);
		// bin 3
		hist.recordValue(200);
		hist.recordValue(300);
		hist.recordValue(1000);
		hist.recordValue(30000);
		// make cumulative and check
		hist = hist.cumulative();
		expect(hist.bins[0]).to.equal(1);
		expect(hist.bins[1]).to.equal(3);
		expect(hist.bins[2]).to.equal(6);
		expect(hist.bins[3]).to.equal(10);
	});

	it('should normalize properly', () => {
		let hist = new Histogram(percentiles);
		// bin 0
		hist.recordValue(0);
		// bin 2
		hist.recordValue(101);
		// bin 3
		hist.recordValue(201);
		// normalize and check
		hist = hist.normalized();
		expect(hist.bins[0]).to.equal(1 / 3);
		expect(hist.bins[1]).to.equal(0);
		expect(hist.bins[2]).to.equal(1 / 3);
		expect(hist.bins[3]).to.equal(1 / 3);
	});

	it('makeCumulative().normalize() should have total 0 if empty', () => {
		let hist = new Histogram(percentiles);
		hist = hist.cumulative().normalized();
		expect(hist.total).to.equal(0);
	});

});
