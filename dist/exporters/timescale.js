"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pgFormat = require("pg-format");
class TimescaleExporter {
    static doExport(client, timestamp, metricName, hist) {
        return __awaiter(this, void 0, void 0, function* () {
            // convert timestamp from unix seconds to iso-8601 
            let time = new Date(timestamp * 1000).toISOString();
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
            // issue the queries
            return Promise.all([
                client.query(bucketQuery),
                client.query(countQuery),
            ]);
        });
    }
}
exports.TimescaleExporter = TimescaleExporter;
;
//# sourceMappingURL=timescale.js.map