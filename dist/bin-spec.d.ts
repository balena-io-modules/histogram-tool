export interface Bin {
    x: number;
}
export declare class BinSpec {
    id: string;
    list: Bin[];
    constructor(id: string, list: Bin[]);
}
export declare function generateLogBinSpec(r: number, n: number): BinSpec;
