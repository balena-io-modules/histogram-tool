"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const percentile_spec_1 = require("../percentile-spec");
// TODO: import redis module
exports.RedisStrategy = {
    load: function (options) {
        // validate redis connection info
        // TODO
        // try to read percentiles from redis 
        // TODO	
        let id = '';
        let list = [];
        return new percentile_spec_1.PercentileSpec(id, list);
    }
};
//# sourceMappingURL=redis-strategy.js.map