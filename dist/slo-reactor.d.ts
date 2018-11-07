import { Histogram } from './histogram';
import { PercentileSpec } from './percentile-spec';
export declare class SLOReactor {
    failReactions: Function[][];
    passReactions: Function[][];
    spec: PercentileSpec;
    constructor(spec: PercentileSpec);
    private addReaction;
    addFailReaction(percentile: number, f: Function): void;
    addPassReaction(percentile: number, f: Function): void;
    reactTo: (hist: Histogram) => void;
}
