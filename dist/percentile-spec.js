"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PercentileSpec {
    constructor(id, list) {
        this.id = id;
        this.list = list;
    }
    toBinSpec() {
        return {
            id: this.id,
            list: this.list.map((percentile) => ({ x: percentile.x }))
        };
    }
}
exports.PercentileSpec = PercentileSpec;
function generateLogPercentileSpec(r, n) {
    let list = [];
    for (let i = 1; i < n; i++) {
        list[i - 1] = {
            p: Math.round(100 * (i / n)) / 100,
            x: Math.pow(r, i),
        };
    }
    return new PercentileSpec(`generated-r-${r}-n-${n}`, list);
}
exports.generateLogPercentileSpec = generateLogPercentileSpec;
//# sourceMappingURL=percentile-spec.js.map