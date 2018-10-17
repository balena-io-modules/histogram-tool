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
}

export function generateLogBinSpec (r : number, n : number) : BinSpec {
	let spec = {
		id: `generated-r-${r}-n-${n}`,
		list: [],
	};
	for (let i = 1; i < n; i++) {
		spec.list[i - 1] = {
			x: Math.pow(r, i),
		};
	}
	return spec;
}
