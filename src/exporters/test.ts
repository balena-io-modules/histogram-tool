interface Exportable {
	doExport(...args: any[]): Promise<any>
};

class APIMetricsBundle implements Exportable {
	x: number
	constructor(x: number) {
		this.x = x;
	}
	static create = (): APIMetricsBundle => {
		return new APIMetricsBundle(-1);
	}
	doExport(msg: string): Promise<any> {
		return Promise.resolve(msg + ` ${this.x}`);
	}
}

let a = new APIMetricsBundle(1337);
a.doExport("the value is:")
	.then((v) => {
		console.log(v);
	});

let c = APIMetricsBundle.create();
