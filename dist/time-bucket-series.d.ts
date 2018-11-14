import { TimeBucket } from './time-bucket';
export declare class TimeBucketSeries<T> {
    windowSecs: number;
    TType: new () => T;
    buckets: Map<number, TimeBucket<T>>;
    constructor(windowSecs: number, TType: new () => T, buckets?: Map<number, TimeBucket<T>>);
    getCurrentTimeBucket(): TimeBucket<T>;
    remove: (timestamp: number) => void;
}
