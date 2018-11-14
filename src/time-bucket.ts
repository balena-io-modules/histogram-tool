// used to keep track of a slice of time in which events can start - allowing us
// to react when all those events have ended and the time period is past
export class TimeBucket<T> {

	constructor(
		// the timestamp associated with this timebucket's *beginning* (ms precision)
		public timestamp: number,
		// the width of the time window for this bucket
		public windowSecs: number,
		// the contents of the time bucket, `o`, is an object of type T
		// (used to put arbitrary data into the bucket)
		public o: T,
		// number of events (ie. requests) pending in this time bucket
		public pending: number = 0
	) {}

	isComplete(): boolean {
		return this.isPast() && this.pending === 0;
	}

	isPast(): boolean {
		return this.timestamp < TimeBucket.currentTimestamp(this.windowSecs);
	}
	
	// return the timestamp of the time bucket we are in at the time this function
	// is called.
	// (for example, if windowSecs = 60, that might be any one of:
	// - 1541461080000
	// - 1541461140000
	// - 1541461200000
	// - 1541461260000
	// )
	static currentTimestamp(windowSecs: number): number {
		return Math.floor(Date.now() / (1000 * windowSecs)) * (1000 * windowSecs);
	}
}
