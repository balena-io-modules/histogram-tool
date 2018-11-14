"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_bucket_1 = require("./time-bucket");
class TimeBucketSeries {
    constructor(windowSecs, TType, buckets = new Map()) {
        this.windowSecs = windowSecs;
        this.TType = TType;
        this.buckets = buckets;
        this.remove = (timestamp) => {
            delete this.buckets[timestamp];
        };
    }
    getCurrentTimeBucket() {
        let currentTimestamp = time_bucket_1.TimeBucket.currentTimestamp(this.windowSecs);
        if (!this.buckets[currentTimestamp]) {
            this.buckets[currentTimestamp] = new time_bucket_1.TimeBucket(currentTimestamp, this.windowSecs, new this.TType());
        }
        return this.buckets[currentTimestamp];
    }
}
exports.TimeBucketSeries = TimeBucketSeries;
//# sourceMappingURL=time-bucket-series.js.map