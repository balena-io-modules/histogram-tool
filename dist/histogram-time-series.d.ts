import { Histogram } from './histogram';
import { BinSpec } from './bin-spec';
import { ExportableTimeBucket } from './time-bucket';
export declare class HistogramTimeSeries {
    list: object;
    windowSecs: number;
    spec: BinSpec;
    constructor(windowSecs: number, spec: BinSpec | number[]);
    currentHistogram(): Histogram;
    canExportBucket(bucket: ExportableTimeBucket): boolean;
    prune: () => Promise<void>;
    scan: (exportFunc: (timestamp: number, hist: Histogram) => Promise<any>) => Promise<any>;
}
