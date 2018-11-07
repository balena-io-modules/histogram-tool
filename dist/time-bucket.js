"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// used to keep track of a slice of time in which events can start - allowing us
// to react when all those events have ended and the time period is past
class TimeBucket {
    constructor(time) {
        this.time = time;
        this.pending = 0;
    }
    toString() {
        return `${this.time}`;
    }
    // return the timestamp of the time bucket we are in at the time this function
    // is called.
    // (for example, if windowSecs = 60, that might be any one of:
    // - 1541461080
    // - 1541461140
    // - 1541461200
    // - 1541461260
    // )
    static currentTime(windowSecs) {
        return Math.floor(Date.now() / 1000 / windowSecs) * windowSecs;
    }
}
exports.TimeBucket = TimeBucket;
//# sourceMappingURL=time-bucket.js.map