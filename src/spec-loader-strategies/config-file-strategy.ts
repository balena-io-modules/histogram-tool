import { BinSpec, PercentileSpec } from '..';
import * as fs from 'fs';

interface ConfigFileStrategyOptions {
	file: string
};

export const ConfigFileStrategy = {
	loadPercentileSpec: function(options: ConfigFileStrategyOptions): PercentileSpec {
		let file = options.file;
		let config = JSON.parse(fs.readFileSync(file).toString());
		return new PercentileSpec(config.id, config.list);
	},
	loadBinSpec: function(options: ConfigFileStrategyOptions): BinSpec {
		let file = options.file;
		let config = JSON.parse(fs.readFileSync(file).toString());
		return new BinSpec(config.id, config.list);
	}
};
