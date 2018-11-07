import { PercentileSpec } from '..';

// TODO: import etcd module

export let EtcdStrategy = {
	load: function(options: object): PercentileSpec {
		// validate redis connection info
		// TODO
		// try to read percentiles from redis 
		// TODO	
		let id = '';
		let list = [];
		return new PercentileSpec(id, list);
	}
};
