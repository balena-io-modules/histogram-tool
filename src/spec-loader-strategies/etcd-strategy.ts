import { BinSpec, PercentileSpec } from '..';
// TODO: import etcd module

interface ConfigFileStrategyOptions {
	file: string
};

export const EtcdStrategy = {
	loadPercentileSpec: function(options): PercentileSpec {
		// validate etcd connection info
		// TODO
		// try to read percentiles from etcd 
		// TODO	
		let id = '';
		let list = [];
		return new PercentileSpec(id, list);
	},
	loadBinSpec: function(options): BinSpec {
		// validate etcd connection info
		// TODO
		// try to read percentiles from etcd 
		// TODO	
		let id = '';
		let list = [];
		return new BinSpec(id, list);
	}
};
