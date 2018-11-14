"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PercentileSpec {
    constructor(
    // id so that different components know that they're operating on the same
    // percentile spec
    id, list) {
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
//# sourceMappingURL=percentile-spec.js.map