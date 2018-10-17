"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinSpec {
    constructor(id, list) {
        this.id = id;
        this.list = list;
    }
}
exports.BinSpec = BinSpec;
function generateLogBinSpec(r, n) {
    let spec = {
        id: `generated-r-${r}-n-${n}`,
        list: [],
    };
    for (let i = 1; i < n; i++) {
        spec.list[i - 1] = {
            x: Math.pow(r, i),
        };
    }
    return spec;
}
exports.generateLogBinSpec = generateLogBinSpec;
//# sourceMappingURL=bin-spec.js.map