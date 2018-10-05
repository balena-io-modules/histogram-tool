"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const percentile_histogram_1 = require("./percentile-histogram");
class PercentileHistogramAccumulator {
    // construct the accumulator with an empty histogram defined by the
    // percentile specs given
    constructor(windowDurationSeconds, percentiles) {
        this.windowDurationSeconds = windowDurationSeconds;
        // sort percentiles just in case
        percentiles.list.sort((a, b) => a.p - b.p);
        this.percentiles = percentiles;
        this.hist = new percentile_histogram_1.PercentileHistogram(percentiles);
    }
    // define the callback for when the window duration seconds is over
    onWindowEnd(f) {
        this.callback = f;
    }
    // start an interval timer that will call the callback
    // (passing it the histogram) every time a the window duration has elapsed
    start() {
        this.interval = setInterval(() => {
            if (this.callback !== undefined) {
                let hist = this.hist.clone();
                this.clear();
                this.callback(hist);
            }
        }, 1000 * this.windowDurationSeconds);
    }
    // stop the callback interval
    stop() {
        if (this.interval !== undefined) {
            console.error('clearing interval');
            clearInterval(this.interval);
        }
    }
    // clear the interval, clear the histogram
    clear() {
        this.hist.clear();
    }
    // add a sample point to the histogram
    addSamplePoint(x) {
        this.hist.addSamplePoint(x);
    }
}
exports.PercentileHistogramAccumulator = PercentileHistogramAccumulator;
//# sourceMappingURL=percentile-histogram-accumulator.js.map