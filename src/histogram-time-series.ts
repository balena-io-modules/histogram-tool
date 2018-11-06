import { shim } from 'promise.prototype.finally';
shim();

import { Histogram } from './histogram';
import { BinSpec } from './bin-spec';
import { TimeBucket, ExportableTimeBucket } from './time-bucket';

export class HistogramTimeSeries {
	// dictionary of ExportableTimeBuckets in the series, keyed by their start
	// timestamp
	list : object
	// the number of seconds per bucket in the series
	nSecs : number
	// the bin spec to use in constructing histograms for each time bucket
	spec : BinSpec
	constructor(nSecs : number, spec : BinSpec) {
		this.list = {};
		this.nSecs = nSecs;
		this.spec = spec;
	}
	// get the current ExportableTimeBucket's Histogram 
	// (using TimeBucket.currentTimeStamp() to get the timestamp to use as an
	// index)
	currentHistogram() : Histogram {
		let currentStart = TimeBucket.currentTimeStamp(this.nSecs);
		if (!this.list[currentStart]) {
			this.list[currentStart] = new ExportableTimeBucket(currentStart, this.spec);
		}
		return this.list[currentStart].hist;
	}
	// whether a given bucket can be exported. Criteria:
	// - is not the time bucket for the current period (according to nSecs)
	// - has `pending == 0`
	// - has `exporting == false`
	// - has `exported == false`
	canExportBucket(bucket : ExportableTimeBucket) : boolean {
		return (bucket.start != TimeBucket.currentTimeStamp(this.nSecs) && 
			bucket.pending == 0 && 
			!bucket.exporting &&
			!bucket.exported);
	}
	// stop keeping track of any buckets which have been exported
	// returns a promise to allow chaining with .scan()
	prune = () => {
		return Promise.resolve(
			Object.keys(this.list).forEach((timestamp) => {
				if (this.list[timestamp].exported) {
					delete this.list[timestamp];
				}
			})
		);
	}
	// pass the histograms of any buckets which can be exported to `exportFunc`,
	// which will return a promise which, if it resolves, will be used to mark 
	// the bucket as `exported = true`, or if it throws an error, will be used to
	// increase `attempts` on the bucket and mark `exporting = false`
	// returns a promise that resolves when all `exportFunc` calls have either
	// resolved or rejected, resolving with the value equal to the numbe of
	// buckets that were successfully exported
	scan = (exportFunc : (hist: Histogram) => Promise<any>) : Promise<any> => {
		return Promise.all(
			Object.values(this.list).map(bucket => {
				if (this.canExportBucket(bucket)) {
					bucket.exporting = true;
					return exportFunc(bucket.hist)
						.then(() => {
							bucket.exported = true;
							return true;
						})
						.catch((err) => {
							console.error(err.stack);
							bucket.attempts++;
							return false;
						})
						.finally(() => {
							bucket.exporting = false;
						});
				}
			})
		).then((arr) => {
			return arr.reduce((accum, x) => accum + (x ? 1 : 0), 0);
		});
	}
}
