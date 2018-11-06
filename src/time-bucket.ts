import { Histogram } from './histogram';
import { BinSpec } from './bin-spec';

export class TimeBucket {
	// the timestamp associated with this timebucket's *beginning*
	start : number	
	// number of requests pending in this time bucket
	pending : number
	// histogram associated with this time bucket
	hist : Histogram

	constructor (start : number, spec : BinSpec) {
		this.start = start;
		this.pending = 0;
		this.hist = new Histogram(spec);
	}

	toString() : string {
		return `${this.start}`;
	}

	// return the timestamp of the time bucket we are in at the time this function
	// is called.
	// (for example, if windowSecs = 60, that might be any one of:
	// - 1541461080
	// - 1541461140
	// - 1541461200
	// - 1541461260
	// )
	static currentTimeStamp(windowSecs : number) : number {
		return Math.floor(new Date().getTime() / 1000 / windowSecs) * windowSecs;
	}
}

// a time bucket which can be exported
export class ExportableTimeBucket extends TimeBucket {
	// number of attempts to export this time bucket
	attempts : number
	// whether this bucket is currently exporting (a flag to avoid trying to 
	// export twice while it's still pending)
	exporting : boolean
	// whether the export succeeded
	exported : boolean
	constructor(start : number, spec : BinSpec) {
		super(start, spec);
		this.attempts = 0;
		this.exporting = false;
		this.exported = false;
	}
	
}


