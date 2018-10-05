export interface Percentile {
	// (eg. 0.9 for 90th percentile)
	p : number;
	// (eg. 300, if measuring latencies and 300 ms is the 90th percentile)
	x : number; 
}

export interface PercentileSpec {
	// id so that different components know that they're operating on the same
	// percentile spec
	id : string;
	list : Percentile[];
}


