import { BinSpec } from './bin-spec';

export interface Percentile {
	// (eg. 0.9 for 90th percentile)
	p : number
	// (eg. 300, if measuring latencies and 300 ms is the 90th percentile)
	x : number 
}

export class PercentileSpec {
	// id so that different components know that they're operating on the same
	// percentile spec
	id : string
	list : Percentile[]
	constructor(id : string, list: Percentile[]) {
		this.id = id;
		this.list = list;
	}
	toBinSpec() : BinSpec {
		return {
			id: this.id,
			list: this.list.map((percentile) => ({x: percentile.x}))
		};
	}
}

export function generateLogPercentileSpec (r : number, n : number) : PercentileSpec {
	let list = [];
	for (let i = 1; i < n; i++) {
		list[i - 1] = {
			p: Math.round(100 * (i / n)) / 100,
			x: Math.pow(r, i),
		};
	}
	return new PercentileSpec(`generated-r-${r}-n-${n}`, list);
}
