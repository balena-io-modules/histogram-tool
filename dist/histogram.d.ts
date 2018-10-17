import { BinSpec } from './bin-spec';
export declare class Histogram {
    spec: BinSpec;
    bins: number[];
    total: number;
    isCumulative: boolean;
    isNormalized: boolean;
    constructor(spec: BinSpec);
    addSamplePoint(x: number): void;
    clear(): void;
    clone(): Histogram;
    cumulative(): Histogram;
    normalized(): Histogram;
}
