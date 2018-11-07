import { BinSpec } from './bin-spec';
export interface Percentile {
    p: number;
    x: number;
}
export declare class PercentileSpec {
    id: string;
    list: Percentile[];
    constructor(id: string, list: Percentile[]);
    toBinSpec(): BinSpec;
}
