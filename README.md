percentile-monitor
===

This module can be used to implement performance monitoring / reactivity based 
on latency histograms and percentile distributions. 

An article describing the basic methodology can be found [here](https://blog.wallaroolabs.com/2018/02/latency-histograms-and-percentile-distributions-in-wallaroo-performance-metrics/).

In english, this module lets us ingest a stream of latencies and, every T
seconds, determine whether their distribution matches expected percentile 
distribution (really, defining an SLO ("Service Level Objective")), like:

	90% below 100 ms
	95% below 300 ms
	99% below 1000 ms

... calling user-supplied callbacks if the SLO fails, or if it passes (which
can be used to, for example, turn on or off a parameter telling our API to
load shed or not to load shed (*that is the question*))

### Details

`index.ts` exposes the 3 classes which can be used separately or together to:

1. build histograms of data points (such as latencies) which fall in ranges
	defined by cutoff points of interest (most often, these will be the cutoff
	values of the percentiles of an expected distribution (the actual proportions
	of the histogram bins may or may not match the expected distribution))

2. build a series of such histograms in time windows

3. react to the observed percentiles either matching or not matching what is 
	expected (if the percentile distribution given tracks SLO's, this means
	determining whether the SLO is passing or failing for each given percentile)

The 3 classes implementing these, respectively, are:

1. `Histogram`

2. `HistogramAccumulator`

3. `PercentileReactor`

### Usage

See `demo.ts`.
