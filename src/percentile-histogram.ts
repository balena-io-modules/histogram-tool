import { PercentileSpec } from './percentile-spec';

export class PercentileHistogram {
	// bins are defined by their left limit being a percentile
	//
	// 		[0, 20), [20, 50), [50, 100), [100, 200), [200, 1000), [1000, inf)
	// 		      0.5       0.8        0.9         0.99         0.999
	percentiles : PercentileSpec;
	// bins hold integer frequency counts before normalization, and real numbers
	// in [0, 1] after normalization
	bins: number[];
	// total number of data points (used for normalization)
	total : number;

	constructor (percentiles : PercentileSpec) {
		// sort percentiles just in case and store (needed for data insertion)
		percentiles.list.sort((a, b) => a.p - b.p);
		this.percentiles = percentiles;
		this.clear();
	}

	// add a sample point to the histogram (increase the count of the appropriate
	// bin)
	addSamplePoint(x : number) {
		let i = 0; 
		while (i < this.percentiles.list.length &&
				x >= this.percentiles.list[i].x) {
			i++;
		}
		this.bins[i]++;
		this.total++;
	}

	// creates empty bins and sets the total count to 0
	clear() {
		this.bins = Array(this.percentiles.list.length + 1).fill(0);
		this.total = 0;
	}

	// create a copy of this histogram
	clone() : PercentileHistogram {
		let clone = new PercentileHistogram(this.percentiles);
		clone.bins = this.bins.slice(); // .slice() makes a copy
		clone.total = this.total;
		return clone;
	}

	// make each bin's number the sum of itself and all lower bins
	makeCumulative() : PercentileHistogram {
		// use a running total to create the cumulative bins
		let runningTotal = 0;
		for (let i = 0; i < this.bins.length; i++) {
			runningTotal += this.bins[i];
			this.bins[i] = runningTotal;
		}
		return this;
	}

	// normalize the bin coutns (make them percentages of the total count)
	normalize() : PercentileHistogram {
		for (let i = 0; i < this.bins.length; i++) {
			this.bins[i] = this.bins[i] / this.total;
		}
		// we want to preserve total === 0 if it is 0, so that
		// anything processing this histogram can know it's empty
		if (this.total > 0) {
			this.total = 1.0;
		}
		return this;
	}
}
