"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_prototype_finally_1 = require("promise.prototype.finally");
promise_prototype_finally_1.shim();
const time_bucket_1 = require("./time-bucket");
// a time bucket which represents a resource that can be exported
class ExportableTimeBucket extends time_bucket_1.TimeBucket {
    // constructor given a timestamp and the zero-value or initial version of 
    // the Exportable object
    constructor(start, exportableObject) {
        super(start);
        this.attempts = 0;
        this.exporting = false;
        this.exported = false;
        this.exportableObject = exportableObject;
    }
}
exports.ExportableTimeBucket = ExportableTimeBucket;
class ExportableTimeSeries {
    constructor(windowSecs, blankExportable) {
        // stop keeping track of any buckets which have been exported
        // returns a promise to allow chaining with .scan()
        this.prune = () => {
            return Promise.resolve(Object.keys(this.buckets).forEach((timestamp) => {
                if (this.buckets[timestamp].exported) {
                    delete this.buckets[timestamp];
                }
            }));
        };
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
        this.scan = () => {
            return Promise.all(Object.values(this.buckets)
                .map((bucket) => __awaiter(this, void 0, void 0, function* () {
                if (!this.canExportBucket(bucket)) {
                    return false;
                }
                bucket.exporting = true;
                try {
                    yield bucket.exportableObject.doExport(bucket.time);
                    bucket.exported = true;
                    delete this.buckets[bucket.time];
                    return true;
                }
                catch (err) {
                    console.error(err.stack);
                    bucket.attempts++;
                    return false;
                }
                finally {
                    bucket.exporting = false;
                }
            }))).then((arr) => {
                return arr.reduce((accum, x) => accum + (x ? 1 : 0), 0);
            });
        };
        this.buckets = new Map();
        this.windowSecs = windowSecs;
        this.blankExportable = blankExportable;
    }
    // get the current ExportableTimeBucket
    // (using TimeBucket.currentTimeStamp() to get the timestamp to use as an
    // index)
    current() {
        let currentTime = time_bucket_1.TimeBucket.currentTime(this.windowSecs);
        if (!this.buckets[currentTime]) {
            this.buckets[currentTime] = new ExportableTimeBucket(currentTime, this.blankExportable());
        }
        return this.buckets[currentTime];
    }
    // whether a given bucket can be exported. Criteria:
    // - is not the time bucket for the current period (according to windowSecs)
    // - has `pending == 0`
    // - has `exporting == false`
    // - has `exported == false`
    canExportBucket(bucket) {
        return (bucket.time != time_bucket_1.TimeBucket.currentTime(this.windowSecs) &&
            bucket.pending == 0 &&
            !bucket.exporting &&
            !bucket.exported);
    }
}
exports.ExportableTimeSeries = ExportableTimeSeries;
//# sourceMappingURL=exportable-time-series.js.map