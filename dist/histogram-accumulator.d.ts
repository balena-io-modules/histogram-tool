/// <reference types="mocha" />
/// <reference types="node" />
import { BinSpec } from './bin-spec';
import { Histogram } from './histogram';
export declare class HistogramAccumulator {
    windowDurationSeconds: number;
    spec: BinSpec;
    hist: Histogram;
    emitter: NodeJS.EventEmitter;
    interval: NodeJS.Timer;
    constructor(windowDurationSeconds: number, spec: BinSpec);
    start(): void;
    stop(): void;
    clear(): void;
    addSamplePoint(x: number): void;
}
