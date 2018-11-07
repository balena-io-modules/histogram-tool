import { TimeBucket, ExportableTimeSeries } from '../src';

import { expect } from 'chai';
import 'mocha';

const percentiles = {
	id: 'test-spec',
	list: [
		{ p: 0.5, x: 30 },
		{ p: 0.9, x: 100 },
		{ p: 0.95, x: 200 }
	]
};
const windowSecs = 0.3;

class MockExportable {
	cb: (timestamp: number) => void
	constructor(cb: (timestamp: number) => void) {
		this.cb = cb;
	}
	async doExport(timestamp: number) {
		this.cb(timestamp);
	}
}

describe('ExportableTimeSeries', () => {

	it('should call `doExport()` on bucket after the window elapsed', (done) => {
		new Promise((resolve, reject) => {
			// create a callback function to listen to MockExportable.doExport()
			// and resolve if it's given the expected timestamp
			const expected = TimeBucket.currentTime(windowSecs);
			const cb = (timestamp: number) => {
				if (timestamp == expected) {
					resolve();
				} else {
					reject(new Error('doExport received wrong timestamp'));
				}
			};
			// blank constructor needed by ExportableTimeSeries
			const blankMockExportable = () => new MockExportable(cb);
			const ets = new ExportableTimeSeries(windowSecs, blankMockExportable);
			ets.current(); // (create a current TimeBucket by asking for it)
			setTimeout(ets.scan, 1000 * windowSecs * 1.5)
		}).then(done).catch(done);
	});

});
