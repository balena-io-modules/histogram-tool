import { PercentileSpec } from './percentile-spec';
import { PercentileHistogram } from './percentile-histogram';
export declare class PercentileReactor {
    failReactions: Function[][];
    passReactions: Function[][];
    percentiles: PercentileSpec;
    constructor(percentiles: PercentileSpec);
    private addReaction;
    addFailReaction(percentile: number, f: Function): void;
    addPassReaction(percentile: number, f: Function): void;
    reactToHistogram(hist: PercentileHistogram): void;
}
