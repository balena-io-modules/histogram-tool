import { HistogramAccumulator, 
	SLOReactor, 
	ConfigFileStrategy } from './src/index';

// create SLOReactor to react to expected SLO (see `demo_spec.json`)
let slo = ConfigFileStrategy.loadPercentileSpec({file: 'demo_spec.json'});
let sloReactor = new SLOReactor(slo);
class HistogramToReactorExporter {
	hist: Histogram
	constructor(hist: Histogram) {
		this.hist = hist;
	}
	async doExport (timestamp: number, hist: Histogram) {

	}
}

let nSecs = 10;
let ets = new ExportableTimeSeries(nSecs, blankReactor);

// add reactor functions to the reactor to handle failing or passing SLOs
for (let percentile of SLO.list) {
	sloReactor.addPassReaction(
		percentile.p, 
		() => console.log(`SLO ${percentile.p} < ${percentile.x} [PASS]`)
	);
	sloReactor.addFailReaction(
		percentile.p, 
		() => console.log(`SLO ${percentile.p} < ${percentile.x} [FAIL]`)
	);
}

// attach the reactor to the accumulator's histogram emitter
histAccum.emitter.on('histogram', (hist) => {
	console.log('got histogram:');
	console.log(hist.bins);
	sloReactor.reactTo(hist);
	histAccum.stop();
});

// start the accumulator and seed it with values
histAccum.start();
for (let i = 0; i < 3; i++) {
	for (let j = 0; j < Math.pow(10, 3 - i); j++) {
		histAccum.addSamplePoint(Math.random() * Math.pow(10, 1.1 * (i + 1)));
	}
}

// after ${accumWindow} seconds, `histAccum` will output its data via its
// event emitter, at which point the reactor will react, and stop the accumulator
// so that the event loop, seeing no more interval timer, will let this script
// end.
