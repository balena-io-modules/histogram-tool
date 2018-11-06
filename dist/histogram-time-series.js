"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_prototype_finally_1 = require("promise.prototype.finally");
promise_prototype_finally_1.shim();
const bin_spec_1 = require("./bin-spec");
const time_bucket_1 = require("./time-bucket");
class HistogramTimeSeries {
    constructor(windowSecs, spec) {
        // stop keeping track of any buckets which have been exported
        // returns a promise to allow chaining with .scan()
        this.prune = () => {
            return Promise.resolve(Object.keys(this.list).forEach((timestamp) => {
                if (this.list[timestamp].exported) {
                    delete this.list[timestamp];
                }
            }));
        };
        // pass the histograms of any buckets which can be exported to `exportFunc`,
        // which will return a promise which, if it resolves, will be used to mark 
        // the bucket as `exported = true`, or if it throws an error, will be used to
        // increase `attempts` on the bucket and mark `exporting = false`
        // returns a promise that resolves when all `exportFunc` calls have either
        // resolved or rejected, resolving with the value equal to the numbe of
        // buckets that were successfully exported
        this.scan = (exportFunc) => {
            return Promise.all(Object.values(this.list).map(bucket => {
                if (this.canExportBucket(bucket)) {
                    bucket.exporting = true;
                    return exportFunc(bucket.start, bucket.hist)
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
            })).then((arr) => {
                return arr.reduce((accum, x) => accum + (x ? 1 : 0), 0);
            });
        };
        this.list = {};
        this.windowSecs = windowSecs;
        // handle type union for `spec` param (idempotent if argument is already
        // of Binspec type)
        this.spec = bin_spec_1.BinSpec.fromBuckets(spec);
    }
    // get the current ExportableTimeBucket's Histogram 
    // (using TimeBucket.currentTimeStamp() to get the timestamp to use as an
    // index)
    currentHistogram() {
        let currentStart = time_bucket_1.TimeBucket.currentTimeStamp(this.windowSecs);
        if (!this.list[currentStart]) {
            this.list[currentStart] = new time_bucket_1.ExportableTimeBucket(currentStart, this.spec);
        }
        return this.list[currentStart].hist;
    }
    // whether a given bucket can be exported. Criteria:
    // - is not the time bucket for the current period (according to windowSecs)
    // - has `pending == 0`
    // - has `exporting == false`
    // - has `exported == false`
    canExportBucket(bucket) {
        return (bucket.start != time_bucket_1.TimeBucket.currentTimeStamp(this.windowSecs) &&
            bucket.pending == 0 &&
            !bucket.exporting &&
            !bucket.exported);
    }
}
exports.HistogramTimeSeries = HistogramTimeSeries;
//# sourceMappingURL=histogram-time-series.js.map