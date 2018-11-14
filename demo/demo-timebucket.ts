import { TDigest } from 'tdigest';
import * as express from 'express';

import { Histogram } from '../src/histogram';
import { TimeBucketSeries } from '../src/time-bucket-series';

let buckets = [0.001, 0.004, 0.016, 0.032, 0.064, 0.128, 0.250, 0.5, 1, 2, 4, 8, 16, 30, 60];

class MetricsBundle {
	constructor(
		public hist: Histogram = new Histogram(buckets),
		public td: TDigest = new TDigest()
	) {}
}

let windowSecs = 10;
let ts = new TimeBucketSeries<MetricsBundle>(windowSecs, MetricsBundle);
console.log(`created time-bucket series with windowSecs: ${windowSecs}`);

setInterval(() => {
	const buckets = Object.values(ts.buckets)
		.filter((bucket) => bucket.isPast() && bucket.pending === 0);
	for (let bucket of buckets) {
		console.log('request latency distribution from',
			`${new Date(bucket.timestamp).toISOString()} to `,
			`${new Date(bucket.timestamp + 1000 * bucket.windowSecs).toISOString()}:`);
		const percentiles = [0.5, 0.9, 0.99, 0.999];
		console.log('percentile\tlatency (s)');
		for (let percentile of percentiles) {
			console.log(`${Math.round(1000 * percentile)/10}\t${bucket.o.td.percentile(percentile)}`);
		}
		console.log('latency histogram bins:');
		let hist = bucket.o.hist.cumulative().normalized();
		for (let [i, bin] of hist.bins.entries()) {
			// let lower = (i == 0) ? 0 : hist.spec.list[i - 1].x;
			let upper = (i == hist.bins.length - 1) ? Infinity : hist.spec.list[i].x;
			// console.log(`[${lower}, ${upper}): ${Math.round(1000 * bin)/10} %`);
			console.log(`${upper}\t${Math.round(1000 * bin)/10}`);
		}
		ts.remove(bucket.timestamp);
	}
}, 2500);


const port = 3000;
const app = express();

app.use((req, res, next) => {
	const t0 = Date.now();
	const timebucket = ts.getCurrentTimeBucket();
	timebucket.pending++;
	const onFinish = () => {
		const latency = (Date.now() - t0)/1000;
		timebucket.o.hist.recordValue(latency);
		timebucket.o.td.push(latency);
		timebucket.pending--;
	};
	res.once('close', onFinish);
	res.once('finish', onFinish);
	next();
});

app.get('/', (req, res) => {
	setTimeout(() => {
		res.status(200);
		res.send();	
	}, -Math.log(Math.random()) * 20000);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
