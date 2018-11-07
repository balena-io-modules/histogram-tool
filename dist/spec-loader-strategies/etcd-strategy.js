"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
// TODO: import etcd module
exports.EtcdStrategy = {
    load: function (options) {
        // validate redis connection info
        // TODO
        // try to read percentiles from redis 
        // TODO	
        let id = '';
        let list = [];
        return new __1.PercentileSpec(id, list);
    }
};
//# sourceMappingURL=etcd-strategy.js.map