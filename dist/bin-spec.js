"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinSpec {
    constructor(id, list) {
        this.id = id;
        this.list = list;
    }
    // used to allow functions to take either an existing BinSpec or simply
    // a list of bucket endpoints (number[]), for example, the Histogram 
    // constructor
    static fromBuckets(buckets) {
        if (buckets instanceof BinSpec) {
            return buckets;
        }
        // NB: typescript sort defaults to lexicographic, so we have to be specific
        buckets.sort((a, b) => a - b);
        return new BinSpec(`fromBuckets-${buckets}`, buckets.map(x => ({ x })));
    }
}
exports.BinSpec = BinSpec;
//# sourceMappingURL=bin-spec.js.map