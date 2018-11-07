export declare class TimeBucket {
    time: number;
    pending: number;
    constructor(time: number);
    toString(): string;
    static currentTime(windowSecs: number): number;
}
