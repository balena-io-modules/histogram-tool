import { PercentileSpec } from './percentile-spec';
import { PercentileHistogram } from './percentile-histogram';

export class PercentileHistogramAccumulator {
	// how long to collect data points before pushing the histogram to the next
	// phase of processing (in seconds)
	windowDurationSeconds : number
	// `percentiles` holds a list of Percentile objects used to establish the
	// expected distribution of values in the time series
	// (eg. percentiles.list might be:
	//
	//   [
	//     { p: 0.5, x: 50 },
	//     { p: 0.9, x: 180 },
	//     { p: 0.99, x: 1000 },
	//   ]
	//
	// )
	percentiles : PercentileSpec
	// `hist` is a histogram where right bin limits are the percentiles
	// of our expected distribution
	hist : PercentileHistogram
	// a callback to run when the given window of seconds has elapsed
	callback : Function
	// interval is the setInterval result used to stop and start the time
	// window
	interval : NodeJS.Timer

	// construct the accumulator with an empty histogram defined by the
	// percentile specs given
	constructor (windowDurationSeconds : number, percentiles : PercentileSpec) {
		this.windowDurationSeconds = windowDurationSeconds;
		// sort percentiles just in case
		percentiles.list.sort((a, b) => a.p - b.p);
		this.percentiles = percentiles;
		this.hist = new PercentileHistogram(percentiles);
	}

	// define the callback for when the window duration seconds is over
	onWindowEnd(f : Function) {
		this.callback = f;
	}

	// start an interval timer that will call the callback
	// (passing it the histogram) every time a the window duration has elapsed
	start() {
		this.interval = setInterval(() => {
			if (this.callback !== undefined) {
				let hist = this.hist.clone();
				this.clear();
				this.callback(hist);
			}
		}, 1000 * this.windowDurationSeconds);
	}

	// stop the callback interval
	stop() {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
	}

	// clear the interval, clear the histogram
	clear() {
		this.hist.clear();
	}

	// add a sample point to the histogram
	addSamplePoint(x : number) {
		this.hist.addSamplePoint(x);
	}
}

