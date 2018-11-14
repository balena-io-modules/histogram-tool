"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// used to keep track of a slice of time in which events can start - allowing us
// to react when all those events have ended and the time period is past
class TimeBucket {
    constructor(
    // the timestamp associated with this timebucket's *beginning* (ms precision)
    timestamp, 
    // the width of the time window for this bucket
    windowSecs, 
    // the contents of the time bucket, `o`, is an object of type T
    // (used to put arbitrary data into the bucket)
    o, 
    // number of events (ie. requests) pending in this time bucket
    pending = 0) {
        this.timestamp = timestamp;
        this.windowSecs = windowSecs;
        this.o = o;
        this.pending = pending;
    }
    isComplete() {
        return this.isPast() && this.pending === 0;
    }
    isPast() {
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
    static currentTimestamp(windowSecs) {
        return Math.floor(Date.now() / (1000 * windowSecs)) * (1000 * windowSecs);
    }
}
exports.TimeBucket = TimeBucket;
//# sourceMappingURL=time-bucket.js.map