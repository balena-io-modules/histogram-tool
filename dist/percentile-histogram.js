"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PercentileHistogram {
    constructor(percentiles) {
        // sort percentiles just in case and store (needed for data insertion)
        percentiles.list.sort((a, b) => a.p - b.p);
        this.percentiles = percentiles;
        this.clear();
    }
    // add a sample point to the histogram (increase the count of the appropriate
    // bin)
    addSamplePoint(x) {
        let i = 0;
        while (i < this.percentiles.list.length &&
            x >= this.percentiles.list[i].x) {
            i++;
        }
        this.bins[i]++;
        this.total++;
    }
    // creates empty bins and sets the total count to 0
    clear() {
        this.bins = Array(this.percentiles.list.length + 1).fill(0);
        this.total = 0;
    }
    // create a copy of this histogram
    clone() {
        let clone = new PercentileHistogram(this.percentiles);
        clone.bins = this.bins.slice(); // .slice() makes a copy
        clone.total = this.total;
        return clone;
    }
    // make each bin's number the sum of itself and all lower bins
    makeCumulative() {
        // use a running total to create the cumulative bins
        let runningTotal = 0;
        for (let i = 0; i < this.bins.length; i++) {
            runningTotal += this.bins[i];
            this.bins[i] = runningTotal;
        }
        return this;
    }
    // normalize the bin coutns (make them percentages of the total count)
    normalize() {
        for (let i = 0; i < this.bins.length; i++) {
            this.bins[i] = this.bins[i] / this.total;
        }
        this.total = 1.0;
        return this;
    }
}
exports.PercentileHistogram = PercentileHistogram;
//# sourceMappingURL=percentile-histogram.js.map