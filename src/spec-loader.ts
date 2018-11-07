import { BinSpec } from './bin-spec';
import { PercentileSpec } from './percentile-spec';

export interface PercentileSpecLoaderStrategy {
	load: (options: object) => PercentileSpec
}

export interface BinSpecLoaderStrategy {
	load: (options: object) => BinSpec
}
