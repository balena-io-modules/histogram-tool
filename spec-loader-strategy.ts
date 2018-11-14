import { BinSpec } from './bin-spec';
import { PercentileSpec } from './percentile-spec';

export interface SpecLoaderStrategy {
	loadPercentileSpec: (options: object) => PercentileSpec
	loadBinSpec: (options: object) => BinSpec
}
