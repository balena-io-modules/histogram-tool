percentile-monitor
===

This module can be used to implement performance monitoring / reactivity based 
on latency histograms and percentile distributions. 

An article describing the basic methodology can be found [here](https://blog.wallaroolabs.com/2018/02/latency-histograms-and-percentile-distributions-in-wallaroo-performance-metrics/).

In english, this module lets us ingest a stream of latencies and, every T
seconds, determine whether their distribution matches expected percentile 
distribution (really, defining an SLA), like:

	90% below 100 ms
	95% below 300 ms
	99% below 1000 ms

... calling user-supplied callbacks if the SLA fails, or if it passes (which
can be used to, for example, turn on or off a parameter telling our API to
start load shedding)

### Details

`index.ts` exposes the 3 classes which can be used separately or together to:

1. build histograms of data points (such as latencies) which fall in ranges
	defined by percentiles of an expected distribution (the actual proportions
	of the histogram bins may or may not match the expected distribution)

2. build a series of such histograms in time windows

3. react to the observed percentiles either matching or not matching what is 
	expected (if the percentile distribution given tracks SLA's, this means
	determining whether the SLA is passing or failing for each given percentile)

The 3 classes implementing these, respectively, are:

1. `PercentileHistogram`

2. `PercentileHistogramAccumulator`

3. `PercentileReactor`

### Example 

```
import { PercentileHistogramAccumulator, PercentileReactor } from ('percentile-monitor');

let percentiles = {
	id: "4d3d3d3", 
	list: [ 
		{ p: 0.5, x: 10 },
		{ p: 0.9, x: 100 },
		{ p: 0.99, x: 1000 } 
	]
};

let pHistAccum = new PercentileHistogramAccumulator(10, percentiles);

let pReactor = new PercentileReactor(percentiles);
for (let percentile of percentiles.list) {
	pReactor.addPassReaction(percentile.p, () => console.log(`passing ${percentile.p}`));
	pReactor.addFailReaction(percentile.p, () => console.log(`failing ${percentile.p}`));
}

pHistAccum.onWindowEnd((hist) => {
	pReactor.reactToHistogram(hist);
});

let N = 100;
for (let i = 0; i < N; i++) {
	pHistAccum.addSamplePoint(Math.random() * 200);
}
pHistAccum.callback(pHistAccum.hist.clone());
```
