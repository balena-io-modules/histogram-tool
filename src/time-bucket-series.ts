import { TimeBucket } from './time-bucket';

export class TimeBucketSeries<T> {

	constructor(
		public windowSecs: number,
		public TType: new() => T,
		public buckets: Map<number, TimeBucket<T>> = new Map<number, TimeBucket<T>>(),
	) {}
	
	getCurrentTimeBucket(): TimeBucket<T> {
		let currentTimestamp = TimeBucket.currentTimestamp(this.windowSecs);
		if (!this.buckets[currentTimestamp]) {
			this.buckets[currentTimestamp] = new TimeBucket<T>(currentTimestamp, this.windowSecs, new this.TType());
		}
		return this.buckets[currentTimestamp];
	}
	
	remove = (timestamp: number) => {
		delete this.buckets[timestamp];
	}

}
