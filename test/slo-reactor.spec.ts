import {
	Histogram,
	PercentileSpec,
	SLOReactor
} from '../src';

import { expect } from 'chai';
import 'mocha';

// 90 % below 100
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

	it('should pass/fail when passing/failing', () => {
		// create SLOReactor expecting fail
		let sloReactor = new SLOReactor(percentiles);
		sloReactor.addPassReaction(0.9, () => {
			throw new Error('failing SLO marked as passing');
		});
		let hist = new Histogram(percentiles);
		for (let i = 0; i < 80; i++) {
			hist.recordValue(99);
		}
		for (let i = 0; i < 20; i++) {
			hist.recordValue(101);
		}
		sloReactor.reactTo(hist);
		// create new SLOReactor expecting pass
		sloReactor = new SLOReactor(percentiles);
		sloReactor.addFailReaction(0.9, () => {
			throw new Error('passing SLO marked as failing');
		});
		for (let i = 0; i < 200; i++) {
			hist.recordValue(99);
		}
		sloReactor.reactTo(hist);
	});

	it('should pass an empty histogram', () => {
		let sloReactor = new SLOReactor(percentiles);
		let hist = new Histogram(percentiles);
		sloReactor.addFailReaction(0.9, () => {
			throw new Error('passing SLO marked as failing');
		});
		sloReactor.reactTo(hist);
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
