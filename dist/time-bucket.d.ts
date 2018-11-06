import { Histogram } from './histogram';
import { BinSpec } from './bin-spec';
export declare class TimeBucket {
    start: number;
    pending: number;
    hist: Histogram;
    constructor(start: number, spec: BinSpec);
    toString(): string;
    static currentTimeStamp(windowSecs: number): number;
}
export declare class ExportableTimeBucket extends TimeBucket {
    attempts: number;
    exporting: boolean;
    exported: boolean;
    constructor(start: number, spec: BinSpec);
}
