import { PercentileSpec } from 'percentile-spec';
export interface PercentileSpecLoaderStrategy {
    load: (options: object) => PercentileSpec;
}
