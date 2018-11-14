"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const fs = require("fs");
;
exports.ConfigFileStrategy = {
    loadPercentileSpec: function (options) {
        let file = options.file;
        let config = JSON.parse(fs.readFileSync(file).toString());
        return new __1.PercentileSpec(config.id, config.list);
    },
    loadBinSpec: function (options) {
        let file = options.file;
        let config = JSON.parse(fs.readFileSync(file).toString());
        return new __1.BinSpec(config.id, config.list);
    }
};
//# sourceMappingURL=config-file-strategy.js.map