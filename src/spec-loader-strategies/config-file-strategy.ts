import { PercentileSpec } from '../percentile-spec';
import * as fs from 'fs';

interface ConfigFileStrategyOptions {
	file : string
};

export let ConfigFileStrategy = {
	load: function (options : ConfigFileStrategyOptions) : PercentileSpec {
		// validate file
		let file = options.file;
		if (file === undefined) {
			throw new Error('new ConfigFileStrategy(options) wants ' +
					'options to have .file');
		}
		let config = JSON.parse(fs.readFileSync(file).toString());
		return new PercentileSpec(config.id, config.list);
	}
};
