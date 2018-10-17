"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PercentileReactor {
    constructor(percentiles) {
        // sort percentiles just in case
        percentiles.list.sort((a, b) => a.p - b.p);
        this.percentiles = percentiles;
        // declare the failReactions and passReactions arrays
        // this is a weird way of declaring a list of N arrays
        this.failReactions = Array.from(Array(percentiles.list.length)).map(() => []);
        this.passReactions = Array.from(Array(percentiles.list.length)).map(() => []);
    }
    // add a reaction to the given list (will be either this.failReactions or
    // this.passReactions)
    addReaction(reactionList, percentile, f) {
        // find the index of this percentile in the list
        let index = this.percentiles.list.map(spec => spec.p).indexOf(percentile);
        reactionList[index].push(f);
    }
    // add a fail reaction for the given percentile
    addFailReaction(percentile, f) {
        this.addReaction(this.failReactions, percentile, f);
    }
    // add a pass reaction for the given percentile
    addPassReaction(percentile, f) {
        this.addReaction(this.passReactions, percentile, f);
    }
    // check if a histogram violates the SLO defined by the `percentiles` object
    // used to construct this PercentileReactor, taking actions defined in 
    // `this.reactions` if so
    reactToHistogram(hist) {
        // operate on a clone
        hist = hist.clone();
        // check that the spec is the same for the incoming histogram
        if (hist.percentiles.id !== this.percentiles.id) {
            throw new Error(`asked to react to histogram with PercentileSpec ` +
                `id: ${hist.percentiles.id}, while this reactor has ` +
                `PercentileSpec id: ${this.percentiles.id}`);
        }
        // make cumulative and normalize
        hist = hist.makeCumulative().normalize();
        // compare bin percentages with the percentile they represent
        for (let i = 0; i < this.percentiles.list.length; i++) {
            let reactionList;
            // by default, an empty histogram means no requests, so we're
            // meeting the SLO if that happens (otherwise, we pass when
            // the percentage of requests less than the given percentile (the
            // value in the bin after makeCumulative().normalize()) is greater
            // or equal to the percentile's definition (eg. 0.9))
            if (hist.total === 0 ||
                hist.bins[i] >= this.percentiles.list[i].p) {
                reactionList = this.passReactions;
            }
            else {
                reactionList = this.failReactions;
            }
            reactionList[i].map(f => f(this.percentiles.list[i], hist.bins[i]));
        }
    }
}
exports.PercentileReactor = PercentileReactor;
//# sourceMappingURL=percentile-reactor.js.map