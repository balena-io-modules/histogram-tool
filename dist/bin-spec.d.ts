import { PercentileSpec } from './percentile-spec';
export interface Bin {
    x: number;
}
export declare class BinSpec {
    id: string;
    list: Bin[];
    constructor(id: string, list: Bin[]);
    static fromUnion(arg: BinSpec | PercentileSpec | number[]): BinSpec;
}
