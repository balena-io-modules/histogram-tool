import * as pg from 'pg';
import { Histogram } from '../histogram';
export declare class TimescaleExporter {
    static doExport(client: pg.Client, timestamp: number, metricName: string, hist: Histogram): Promise<any>;
}
