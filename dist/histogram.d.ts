import { BinSpec } from './bin-spec';
import { PercentileSpec } from './percentile-spec';
export declare class Histogram {
    spec: BinSpec;
    bins: number[];
    total: number;
    isCumulative: boolean;
    isNormalized: boolean;
    constructor(spec: BinSpec | PercentileSpec | number[]);
    recordValue(x: number): void;
    clear(): void;
    clone(): Histogram;
    cumulative(): Histogram;
    normalized(): Histogram;
}
