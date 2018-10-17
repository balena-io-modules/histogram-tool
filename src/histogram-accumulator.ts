import { EventEmitter } from 'events';

import { BinSpec } from './bin-spec';
import { Histogram } from './histogram';

export class HistogramAccumulator {
	// how long to collect data points before pushing the histogram to the next
	// phase of processing (in seconds)
	windowDurationSeconds : number
	// bins are defined by their left limit, for example:
	// if spec = [{x: 20}, {x: 50}, {x: 100}, {x: 200}, {x: 1000}],
	// we have bins:
	// 		[0, 20), [20, 50), [50, 100), [100, 200), [200, 1000), [1000, inf)
	spec : BinSpec 
	// `hist` is a histogram where right bin limits are the cutoffs specified
	// in the histogram 
	hist : Histogram 
	// an event emitter which emits histograms periodically
	emitter : NodeJS.EventEmitter 	
	// interval is the setInterval result used to stop and start the time
	// window
	interval : NodeJS.Timer

	// construct the accumulator with an empty histogram defined by the
	// BinSpec given
	constructor (windowDurationSeconds : number, spec : BinSpec) {
		this.windowDurationSeconds = windowDurationSeconds;
		// sort spec just in case (we need to use the index of the buckets in
		// sorted order to compare data points)
		spec.list.sort((a, b) => a.x - b.x);
		this.spec = spec;
		this.hist = new Histogram(spec);
		this.emitter = new EventEmitter();
	}

	// start an interval timer that will call the callback
	// (passing it the histogram) every time a the window duration has elapsed
	start() {
		this.interval = setInterval(() => {
			let hist = this.hist.clone();
			this.clear();
			this.emitter.emit('histogram', hist);
		}, 1000 * this.windowDurationSeconds);
	}

	// stop the callback interval
	stop() {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
	}

	// clear the histogram
	clear() {
		this.hist.clear();
	}

	// add a sample point to the histogram
	addSamplePoint(x : number) {
		this.hist.addSamplePoint(x);
	}
}

