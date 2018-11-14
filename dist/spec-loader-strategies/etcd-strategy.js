"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
;
exports.EtcdStrategy = {
    loadPercentileSpec: function (options) {
        // validate etcd connection info
        // TODO
        // try to read percentiles from etcd 
        // TODO	
        let id = '';
        let list = [];
        return new __1.PercentileSpec(id, list);
    },
    loadBinSpec: function (options) {
        // validate etcd connection info
        // TODO
        // try to read percentiles from etcd 
        // TODO	
        let id = '';
        let list = [];
        return new __1.BinSpec(id, list);
    }
};
//# sourceMappingURL=etcd-strategy.js.map