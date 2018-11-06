"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const histogram_1 = require("./histogram");
class TimeBucket {
    constructor(start, spec) {
        this.start = start;
        this.pending = 0;
        this.hist = new histogram_1.Histogram(spec);
    }
    toString() {
        return `${this.start}`;
    }
    // return the timestamp of the time bucket we are in at the time this function
    // is called.
    // (for example, if windowSecs = 60, that might be any one of:
    // - 1541461080
    // - 1541461140
    // - 1541461200
    // - 1541461260
    // )
    static currentTimeStamp(windowSecs) {
        return Math.floor(new Date().getTime() / 1000 / windowSecs) * windowSecs;
    }
}
exports.TimeBucket = TimeBucket;
// a time bucket which can be exported
class ExportableTimeBucket extends TimeBucket {
    constructor(start, spec) {
        super(start, spec);
        this.attempts = 0;
        this.exporting = false;
        this.exported = false;
    }
}
exports.ExportableTimeBucket = ExportableTimeBucket;
//# sourceMappingURL=time-bucket.js.map