import { BinSpec } from './bin-spec';
import { PercentileSpec } from './percentile-spec';
import * as hdr from 'hdr-histogram-js';

export class Histogram {
	// bins are defined by their left limit, for example:
	//
	// if spec = [{x: 20}, {x: 50}, {x: 100}, {x: 200}, {x: 1000}],
	//
	// we have bins:
	//
	// 		[0, 20), [20, 50), [50, 100), [100, 200), [200, 1000), [1000, inf)
	spec: BinSpec
	// `bins` hold numbers:
	// - frequency of sample points in that bin by default
	// - cumulative frequency if isCumulative
	// - proportion if isNormalized
	// - proportion less than right endpoint if isCumulative and isNormalized
	bins: number[]
	// total number of data points (used for normalization)
	total: number
	// predicates set by the cumulative() and normalized() methods (allows
	// code receiving a histogram to know if it needs to transform it)
	isCumulative: boolean
	isNormalized: boolean

	// can take either a BinSpec, PercentileSpec, or a number[] representing 
	// right endpoints for bins
	constructor(spec: BinSpec | PercentileSpec | number[]) {
		// handle type union for `spec` param (idempotent if argument is already
		// of Binspec type)
		this.spec = BinSpec.fromUnion(spec);
		this.clear();
		this.isCumulative = false;
		this.isNormalized = false;
	}

	// add a sample point to the histogram (increase the count of the appropriate
	// bin)
	recordValue(x: number) {
		let i = 0;
		while (i < this.spec.list.length &&
			x >= this.spec.list[i].x) {
			i++;
		}
		this.bins[i]++;
		this.total++;
	}

	// creates empty bins and sets the total count to 0
	clear() {
		this.bins = Array(this.spec.list.length + 1).fill(0);
		this.total = 0;
	}

	// create a copy of this histogram
	clone(): Histogram {
		let clone = new Histogram(this.spec);
		clone.bins = this.bins.slice(); // .slice() makes a copy
		clone.total = this.total;
		clone.isCumulative = this.isCumulative;
		clone.isNormalized = this.isNormalized;
		return clone;
	}

	// fill this.cumulativeBins, each bin's number being the sum of itself and
	// all lower bins
	cumulative(): Histogram {
		let clone = this.clone();
		let runningTotal = 0;
		for (let i = 0; i < clone.bins.length; i++) {
			runningTotal += clone.bins[i];
			clone.bins[i] = runningTotal;
		}
		clone.isCumulative = true;
		return clone;
	}

	// normalize the bin coutns (make them percentages of the total count)
	normalized(): Histogram {
		let clone = this.clone();
		// avoid division by 0
		if (clone.total != 0) {
			for (let i = 0; i < clone.bins.length; i++) {
				clone.bins[i] = clone.bins[i] / clone.total;
			}
		}
		clone.isNormalized = true;
		return clone;
	}
}
