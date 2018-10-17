"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Histogram {
    constructor(spec) {
        // sort BinSpec.list just in case and (needed for proper data insertion)
        spec.list.sort((a, b) => a.x - b.x);
        this.spec = spec;
        this.clear();
        this.isCumulative = false;
        this.isNormalized = false;
    }
    // add a sample point to the histogram (increase the count of the appropriate
    // bin)
    addSamplePoint(x) {
        let i = 0;
        while (i < this.spec.list.length &&
            x >= this.spec.list[i].x) {
            i++;
        }
        this.bins[i]++;
        this.total++;
    }
    // creates empty bins and sets the total count to 0
    clear() {
        this.bins = Array(this.spec.list.length + 1).fill(0);
        this.total = 0;
    }
    // create a copy of this histogram
    clone() {
        let clone = new Histogram(this.spec);
        clone.bins = this.bins.slice(); // .slice() makes a copy
        clone.total = this.total;
        clone.isCumulative = this.isCumulative;
        clone.isNormalized = this.isNormalized;
        return clone;
    }
    // fill this.cumulativeBins, each bin's number being the sum of itself and
    // all lower bins
    cumulative() {
        let clone = this.clone();
        let runningTotal = 0;
        for (let i = 0; i < clone.bins.length; i++) {
            runningTotal += clone.bins[i];
            clone.bins[i] = runningTotal;
        }
        clone.isCumulative = true;
        return clone;
    }
    // normalize the bin coutns (make them percentages of the total count)
    normalized() {
        let clone = this.clone();
        for (let i = 0; i < clone.bins.length; i++) {
            clone.bins[i] = clone.bins[i] / clone.total;
        }
        // we want to preserve total === 0 if it is 0, so clone
        // anything processing clone histogram can know it's empty
        if (clone.total > 0) {
            clone.total = 1.0;
        }
        clone.isNormalized = true;
        return clone;
    }
}
exports.Histogram = Histogram;
//# sourceMappingURL=histogram.js.map