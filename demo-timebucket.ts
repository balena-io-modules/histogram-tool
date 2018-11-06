import { Histogram } from './src/histogram'
import { HistogramTimeSeries } from './src/histogram-time-series'
import { binSpecFromBuckets } from './src/bin-spec'

let buckets = [0.001, 0.004, 0.016, 0.032, 0.064, 0.128];
let nSecs = 10;
let binSpec = binSpecFromBuckets(buckets);
let hts = new HistogramTimeSeries(nSecs, binSpec);
console.log(`created HistogramTimeSeries with nSecs: ${nSecs}, buckets: ${buckets}`);

let N = 32;
for (let i = 0; i < N; i++) {
	hts.currentHistogram().addSamplePoint(Math.random() * 0.256);
}
console.log(`added ${N} sample points`);

const exportFunc = (hist : Histogram) : Promise<any> => {
	console.log('[export of histogram succeeded]');
	return Promise.resolve(true);
};

let nScans = 0;
const doScan = () => {
	console.log('=== SCAN ===');
	hts.scan(exportFunc)
		.then((nExported : number) => {
			nScans++;
			console.log(`scan #${nScans} of HistogramTimeSeries complete`);
			console.log(`${nExported} buckets exported`);
		})
		.then(hts.prune)
		.then(() => {
			console.log(`after HistogramTimeSeries.prune(), ` +
				`${Object.keys(hts.list).length} buckets remaining`);
		});
};

setInterval(doScan, 2000);
