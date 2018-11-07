"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SLOReactor {
    constructor(spec) {
        // check if a histogram violates the SLO defined by the `spec` object
        // used to construct this SLOReactor, taking actions defined in 
        // `this.reactions` if so
        this.reactTo = (hist) => {
            // make cumulative and normalized if needed
            if (!hist.isCumulative) {
                hist = hist.cumulative();
            }
            if (!hist.isNormalized) {
                hist = hist.normalized();
            }
            // check that the spec is the same for the incoming histogram
            if (hist.spec.id !== this.spec.id) {
                throw new Error(`asked to react to histogram with BinSpec` +
                    `id: ${hist.spec.id}, while this reactor has ` +
                    `PercentileSpec id: ${this.spec.id}`);
            }
            // compare bin percentages with the percentile they represent
            for (let i = 0; i < this.spec.list.length; i++) {
                let reactions;
                // by default, an empty histogram means no requests, so we're
                // meeting the SLO if that happens (otherwise, we pass when
                // the percentage of requests less than the given percentile (the
                // value in the bin after makeCumulative().normalize()) is greater
                // or equal to the percentile's definition (eg. 0.9))
                if (hist.total === 0 ||
                    hist.bins[i] >= this.spec.list[i].p) {
                    reactions = this.passReactions[i];
                }
                else {
                    reactions = this.failReactions[i];
                }
                for (let reaction of reactions) {
                    const p = this.spec.list[i];
                    const observed = hist.bins[i];
                    reaction(p, observed);
                }
            }
        };
        // sort spec just in case - we need them in sorted order
        spec.list.sort((a, b) => a.p - b.p);
        this.spec = spec;
        // declare the failReactions and passReactions arrays
        // this is a weird way of declaring a list of N arrays
        this.failReactions = Array.from(Array(spec.list.length)).map(() => []);
        this.passReactions = Array.from(Array(spec.list.length)).map(() => []);
    }
    // add a reaction to the given list (will be either this.failReactions or
    // this.passReactions)
    addReaction(reactionList, percentile, f) {
        // find the index of this percentile in the list
        let index = this.spec.list.map(spec => spec.p).indexOf(percentile);
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
}
exports.SLOReactor = SLOReactor;
//# sourceMappingURL=slo-reactor.js.map