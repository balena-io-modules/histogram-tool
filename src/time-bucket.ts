import { Histogram } from './histogram';

// used to keep track of a slice of time in which events can start - allowing us
// to react when all those events have ended and the time period is past
export class TimeBucket {
	// the timestamp associated with this timebucket's *beginning* (ms precision)
	time: number
	// number of events (ie. requests) pending in this time bucket
	pending: number

	constructor(time: number) {
		this.time = time;
		this.pending = 0;
	}

	toString(): string {
		return `${this.time}`;
	}

	// return the timestamp of the time bucket we are in at the time this function
	// is called.
	// (for example, if windowSecs = 60, that might be any one of:
	// - 1541461080000
	// - 1541461140000
	// - 1541461200000
	// - 1541461260000
	// )
	static currentTime(windowSecs: number): number {
		return Math.floor(Date.now() / (1000 * windowSecs)) * (1000 * windowSecs);
	}
}
