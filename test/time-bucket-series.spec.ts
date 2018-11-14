import { TimeBucket, TimeBucketSeries } from '../src';

import { expect } from 'chai';
import 'mocha';

const windowSecs = 0.3;

class MetricsBundle {
	constructor(
		public count: number = 0
	) {}
}

describe('TimeBucketSeries', () => {

	it('should create bucket on get', () => {
		const ts = new TimeBucketSeries<MetricsBundle>(windowSecs, MetricsBundle);
		console.error(ts.buckets);
		expect(Object.keys(ts.buckets).length).to.equal(0);
		ts.getCurrentTimeBucket();
		expect(Object.keys(ts.buckets).length).to.equal(1);
	});

});
