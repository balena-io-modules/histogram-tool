import { shim } from 'promise.prototype.finally';
shim();

import { TimeBucket } from './time-bucket';

// an object which is exportable (ie., to a database)
// the function doExport() can take any arguments, and returns a promise.
// returning a resolving promise indicates the export succeeded, a rejecting
// promise indicates export failure
export interface Exportable {
	doExport(...args: any[]): Promise<any>
}

// a time bucket which represents a resource that can be exported
export class ExportableTimeBucket<T extends Exportable> extends TimeBucket {
	// number of attempts to export this time bucket
	attempts: number
	// whether this bucket is currently exporting (a flag to avoid trying to 
	// export twice while it's still pending)
	exporting: boolean
	// whether the export succeeded
	exported: boolean
	// the exportable object in this time bucket
	exportableObject: T
	// constructor given a timestamp and the zero-value or initial version of 
	// the Exportable object
	constructor(start: number, exportableObject: T) {
		super(start);
		this.attempts = 0;
		this.exporting = false;
		this.exported = false;
		this.exportableObject = exportableObject;
	}
}

export class ExportableTimeSeries<T extends Exportable> {
	// map of ExportableTimeBuckets in the series, keyed by their start
	// timestamp
	buckets: Map<number, ExportableTimeBucket<T>>
	// the number of seconds per bucket in the series
	windowSecs: number
	// a function that can be used to create new Exportable objects for new time
	// buckets (no params, but if config needed, use a closure over a config
	// object)
	blankExportable: () => T
	constructor(windowSecs: number, blankExportable: () => T) {
		this.buckets = new Map<number, ExportableTimeBucket<T>>();
		this.windowSecs = windowSecs;
		this.blankExportable = blankExportable;
	}
	// get the current ExportableTimeBucket
	// (using TimeBucket.currentTimeStamp() to get the timestamp to use as an
	// index)
	current(): ExportableTimeBucket<T> {
		let currentTime = TimeBucket.currentTime(this.windowSecs);
		if (!this.buckets[currentTime]) {
			this.buckets[currentTime] = new ExportableTimeBucket<T>(currentTime, this.blankExportable());
		}
		return this.buckets[currentTime];
	}
	// whether a given bucket can be exported. Criteria:
	// - is not the time bucket for the current period (according to windowSecs)
	// - has `pending == 0`
	// - has `exporting == false`
	// - has `exported == false`
	canExportBucket(bucket: ExportableTimeBucket<T>): boolean {
		return (bucket.time != TimeBucket.currentTime(this.windowSecs) &&
			bucket.pending == 0 &&
			!bucket.exporting &&
			!bucket.exported);
	}
	// stop keeping track of any buckets which have been exported
	// returns a promise to allow chaining with .scan()
	prune = () => {
		return Promise.resolve(
			Object.keys(this.buckets).forEach((timestamp) => {
				if (this.buckets[timestamp].exported) {
					delete this.buckets[timestamp];
				}
			})
		);
	}
	// pass the timestamps of any buckets which can be exported to `doExport()`
	// on the Exportable objects in those buckets
	//
	// `doExport()` will return a promise which, if it resolves, will be used to 
	// mark the bucket as `exported = true`, or if it throws an error, will be 
	// used to increase `attempts` on the bucket and mark `exporting = false`
	//
	// returns a promise that resolves when all `doExport()` calls have either
	// resolved or rejected, resolving with the value equal to the number of
	// buckets that were successfully exported
	scan = (): Promise<any> => {
		return Promise.all(
			Object.values(this.buckets)
				.map(async (bucket) => {
					if (!this.canExportBucket(bucket)) {
						return false;
					}
					bucket.exporting = true;
					try {
						await bucket.exportableObject.doExport(bucket.time)
						bucket.exported = true;
						delete this.buckets[bucket.time];
						return true;
					} catch (err) {
						console.error(err.stack);
						bucket.attempts++;
						return false;
					} finally {
						bucket.exporting = false;
					}
				})
		).then((arr) => {
			return arr.reduce((accum, x) => accum + (x ? 1 : 0), 0);
		});
	}
}
