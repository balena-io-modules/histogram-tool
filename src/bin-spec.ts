export interface Bin {
	// (eg. the right-cutoff of the bin)
	x : number
}

export class BinSpec {
	id : string
	list : Bin[]
	constructor(id : string, list : Bin[]) {
		this.id = id;
		this.list = list;
	}
	// used to allow functions to take either an existing BinSpec or simply
	// a list of bucket endpoints (number[]), for example, the Histogram 
	// constructor
	static fromBuckets (buckets : number[] | BinSpec) : BinSpec {
		if (buckets instanceof BinSpec) {
			return buckets;
		}
		// NB: typescript sort defaults to lexicographic, so we have to be specific
		buckets.sort((a, b) => a - b);
		return new BinSpec(`fromBuckets-${buckets}`, buckets.map(x => ({ x })));
	}
}
