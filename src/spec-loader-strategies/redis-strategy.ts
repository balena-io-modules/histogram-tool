import { PercentileSpec } from '../percentile-spec';

// TODO: import redis module

export let RedisStrategy = {
	load: function (options : object) : PercentileSpec {
		// validate redis connection info
		// TODO
		// try to read percentiles from redis 
		// TODO	
		let id = '';
		let list = [];
		return new PercentileSpec(id, list);	
	}
};
