"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const percentile_spec_1 = require("../percentile-spec");
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
        return new percentile_spec_1.PercentileSpec(config.id, config.list);
    }
};
//# sourceMappingURL=config-file-strategy.js.map