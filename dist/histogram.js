"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bin_spec_1 = require("./bin-spec");
class Histogram {
    // can take either a BinSpec, PercentileSpec, or a number[] representing 
    // right endpoints for bins
    constructor(spec) {
        // handle type union for `spec` param (idempotent if argument is already
        // of Binspec type)
        this.spec = bin_spec_1.BinSpec.fromUnion(spec);
        this.clear();
        this.isCumulative = false;
        this.isNormalized = false;
    }
    // add a sample point to the histogram (increase the count of the appropriate
    // bin)
    observe(x) {
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
        // avoid division by 0
        if (clone.total != 0) {
            for (let i = 0; i < clone.bins.length; i++) {
                clone.bins[i] = clone.bins[i] / clone.total;
            }
        }
        clone.isNormalized = true;
        return clone;
    }
}
exports.Histogram = Histogram;
//# sourceMappingURL=histogram.js.map