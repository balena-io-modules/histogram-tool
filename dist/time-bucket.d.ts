export declare class TimeBucket<T> {
    timestamp: number;
    windowSecs: number;
    o: T;
    pending: number;
    constructor(timestamp: number, windowSecs: number, o: T, pending?: number);
    isComplete(): boolean;
    isPast(): boolean;
    static currentTimestamp(windowSecs: number): number;
}
