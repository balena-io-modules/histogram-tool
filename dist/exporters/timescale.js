"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgFormat = require("pg-format");
// exports a histogram to timescale given a client - assumes a particular table
// structure.
function timescaleExporter(client, timestamp, metricName, hist) {
    // convert timestamp to iso-8601 
    let time = new Date(timestamp).toISOString();
    const job = 'api';
    // helper function that returns the right value for `le` given a bin index
    const le = (i) => ((i < hist.bins.length - 1) ? hist.spec.list[i].x : 'Infinity');
    // create the query for ${metricName}_bucket
    const bucketValues = hist.cumulative().bins.map((frequency, i) => ([
        time,
        frequency,
        le(i),
        job
    ]));
    const bucketQuery = pgFormat(`INSERT INTO 
			${metricName}_bucket(time, frequency, le, job) 
			VALUES %L;`, bucketValues);
    // create the query for ${metricName}_count
    const countValues = hist.cumulative().bins.map((i, _frequency) => ([
        time,
        hist.total,
        le(i),
        job
    ]));
    const countQuery = pgFormat(`INSERT INTO
			${metricName}_count(time, count, le, job) 
			VALUES %L;`, countValues);
    console.log(bucketQuery);
    // issue the queries
    return Promise.all([
        client.query(bucketQuery),
        client.query(countQuery),
    ]);
}
exports.timescaleExporter = timescaleExporter;
;
//# sourceMappingURL=timescale.js.map