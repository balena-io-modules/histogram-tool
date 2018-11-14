import { BinSpec } from './bin-spec';
import { PercentileSpec } from './percentile-spec';

export interface PercentileSpecLoaderStrategy {
	loadPercentileSpec: (options) => PercentileSpec
	loadBinSpec: (options) => BinSpec
}
