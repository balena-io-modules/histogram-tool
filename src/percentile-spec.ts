import { BinSpec } from './bin-spec';

export interface Percentile {
	// (eg. 0.9 for 90th percentile)
	p: number
	// (eg. 300, if measuring latencies and 300 ms is the 90th percentile)
	x: number
}

export class PercentileSpec {
	
	constructor(
		// id so that different components know that they're operating on the same
		// percentile spec
		public id: string, 
		public list: Percentile[]
	) {}

	toBinSpec(): BinSpec {
		return {
			id: this.id,
			list: this.list.map((percentile) => ({ x: percentile.x }))
		};
	}
}
