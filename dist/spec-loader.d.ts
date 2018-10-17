import { PercentileSpec } from './percentile-spec';
import { BinSpec } from './bin-spec';
export interface PercentileSpecLoaderStrategy {
    load: (options: object) => PercentileSpec;
}
export interface BinSpecLoaderStrategy {
    load: (options: object) => BinSpec;
}
