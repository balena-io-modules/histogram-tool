"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const histogram_1 = require("./histogram");
class HistogramAccumulator {
    // construct the accumulator with an empty histogram defined by the
    // BinSpec given
    constructor(windowDurationSeconds, spec) {
        this.windowDurationSeconds = windowDurationSeconds;
        // sort spec just in case (we need to use the index of the buckets in
        // sorted order to compare data points)
        spec.list.sort((a, b) => a.x - b.x);
        this.spec = spec;
        this.hist = new histogram_1.Histogram(spec);
        this.emitter = new events_1.EventEmitter();
    }
    // start an interval timer that will call the callback
    // (passing it the histogram) every time a the window duration has elapsed
    start() {
        this.interval = setInterval(() => {
            let hist = this.hist.clone();
            this.clear();
            this.emitter.emit('histogram', hist);
        }, 1000 * this.windowDurationSeconds);
    }
    // stop the callback interval
    stop() {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
    }
    // clear the histogram
    clear() {
        this.hist.clear();
    }
    // add a sample point to the histogram
    addSamplePoint(x) {
        this.hist.addSamplePoint(x);
    }
}
exports.HistogramAccumulator = HistogramAccumulator;
//# sourceMappingURL=histogram-accumulator.js.map