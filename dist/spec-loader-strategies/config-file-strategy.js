"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const fs = require("fs");
;
exports.ConfigFileStrategy = {
    load: function (options) {
        // validate file
        let file = options.file;
        if (file === undefined) {
            throw new Error('new ConfigFileStrategy(options) wants ' +
                'options to have .file');
        }
        let config = JSON.parse(fs.readFileSync(file).toString());
        return new __1.PercentileSpec(config.id, config.list);
    }
};
//# sourceMappingURL=config-file-strategy.js.map