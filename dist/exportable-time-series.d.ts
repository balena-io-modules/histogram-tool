import { TimeBucket } from './time-bucket';
export interface Exportable {
    doExport(...args: any[]): Promise<any>;
}
export declare class ExportableTimeBucket<T extends Exportable> extends TimeBucket {
    attempts: number;
    exporting: boolean;
    exported: boolean;
    exportableObject: T;
    constructor(start: number, exportableObject: T);
}
export declare class ExportableTimeSeries<T extends Exportable> {
    buckets: Map<number, ExportableTimeBucket<T>>;
    windowSecs: number;
    blankExportable: () => T;
    constructor(windowSecs: number, blankExportable: () => T);
    current(): ExportableTimeBucket<T>;
    canExportBucket(bucket: ExportableTimeBucket<T>): boolean;
    prune: () => Promise<void>;
    scan: () => Promise<number>;
}
