/// <reference types="node" />
import { PercentileSpec } from './percentile-spec';
import { PercentileHistogram } from './percentile-histogram';
export declare class PercentileHistogramAccumulator {
    windowDurationSeconds: number;
    percentiles: PercentileSpec;
    hist: PercentileHistogram;
    callback: Function;
    interval: NodeJS.Timer;
    constructor(windowDurationSeconds: number, percentiles: PercentileSpec);
    onWindowEnd(f: Function): void;
    start(): void;
    stop(): void;
    clear(): void;
    addSamplePoint(x: number): void;
}
