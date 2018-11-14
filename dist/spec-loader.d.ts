import { BinSpec } from './bin-spec';
import { PercentileSpec } from './percentile-spec';
export interface PercentileSpecLoaderStrategy {
    loadPercentileSpec: (options: any) => PercentileSpec;
    loadBinSpec: (options: any) => BinSpec;
}
