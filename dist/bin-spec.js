"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const percentile_spec_1 = require("./percentile-spec");
class BinSpec {
    constructor(id, list) {
        this.id = id;
        this.list = list;
    }
    // used to allow code needing a BinSpec to take either an existing BinSpec, a 
    // PercentileSpec, or simply a list of bucket endpoints (number[])
    static fromUnion(arg) {
        if (arg instanceof BinSpec) {
            return arg;
        }
        if (arg instanceof percentile_spec_1.PercentileSpec) {
            return new BinSpec(arg.id, arg.list.map((p) => ({ x: p.x })));
        }
        if (arg instanceof Array) {
            // NB: typescript sort defaults to lexicographic, so we have to be 
            // specific about how to sort a number[]
            arg.sort((a, b) => a - b);
            return new BinSpec(`fromBuckets-${arg}`, arg.map(x => ({ x })));
        }
    }
}
exports.BinSpec = BinSpec;
//# sourceMappingURL=bin-spec.js.map