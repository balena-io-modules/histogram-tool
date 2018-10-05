import { PercentileSpec } from './percentile-spec';
import { PercentileHistogram } from './percentile-histogram';

export class PercentileReactor {
	// `failReactions` and `passReactions` are lists of lists of functions where
	// the index of outer list is the index of a corresponding percentile in 
	// the given PercentileSpec.list, and the inner list is a set of functions to 
	// invoke when that percentile is exceeded / not exceeded in the incoming 
	// histogram
	//
	// (we "exceed" if the measured data has less than p percent data points
	// below the Percentile.x value)
	//
	// eg. if we have: 
	//     Percentile { p: 0.9, x: 300 }
	//
	// and we get:
	// 	   (# of values below 300) / (total # of values)  <  0.9
	//
	//     then we're busting the 90th percentile, and if we had a 
	//     PercentileSpec given at construction in which the Percentile
	//     with .p = 0.9 was at index 2, we would run the functions in 
	//     `this.failReactions[2]` (for example, we notify Redis that SLA is
	//     now failing)
	//
	// If, on the other hand, we had
	//     (# of values below percentile 0.9) / (total # of values) >= 0.9
	//
	//     then we would run the corresponding functions in `this.passReactions`
	//     (for example, we might notify Redis that SLA is now passing)
	//
	// Both pass and fail reaction functions should have the param signature:
	//
	// (percentile : Percentile, observed : number)
	//
	// ... where `observed` is the observed
	failReactions : Function[][];
	passReactions : Function[][];
	// stored for reference
	percentiles : PercentileSpec;

	constructor (percentiles : PercentileSpec) {
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
	private addReaction (reactionList : Function[][], percentile : number, f : Function) {
		// find the index of this percentile in the list
		let index = this.percentiles.list.map(spec => spec.p).indexOf(percentile);
		reactionList[index].push(f);
	}

	// add a fail reaction for the given percentile
	addFailReaction (percentile : number, f : Function) {
		this.addReaction(this.failReactions, percentile, f);
	}

	// add a pass reaction for the given percentile
	addPassReaction (percentile : number, f : Function) {
		this.addReaction(this.passReactions, percentile, f);
	}

	// check if a histogram violates the SLA defined by the `percentiles` object
	// used to construct this PercentileReactor, taking actions defined in 
	// `this.reactions` if so
	reactToHistogram(hist : PercentileHistogram) {
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
			let reactionList : Function[][];
			// by default, an empty histogram means no requests, so we're
			// meeting the SLA if that happens (otherwise, we pass when
			// the percentage of requests less than the given percentile (the
			// value in the bin after makeCumulative().normalize()) is greater
			// or equal to the percentile's definition (eg. 0.9))
			if (hist.total === 0 ||
				hist.bins[i] >= this.percentiles.list[i].p) {
				reactionList = this.passReactions;
			} else {
				reactionList = this.failReactions;
			}
			reactionList[i].map(f => 
				f(this.percentiles.list[i], hist.bins[i])
			);
		}
	}
}
