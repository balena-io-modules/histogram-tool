import { PercentileSpec } from './percentile-spec';
export declare class PercentileHistogram {
    percentiles: PercentileSpec;
    bins: number[];
    total: number;
    constructor(percentiles: PercentileSpec);
    addSamplePoint(x: number): void;
    clear(): void;
    clone(): PercentileHistogram;
    makeCumulative(): PercentileHistogram;
    normalize(): PercentileHistogram;
}
