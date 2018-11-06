export interface Bin {
    x: number;
}
export declare class BinSpec {
    id: string;
    list: Bin[];
    constructor(id: string, list: Bin[]);
    static fromBuckets(buckets: number[] | BinSpec): BinSpec;
}
