import * as pg from 'pg';
import { Histogram } from '..';
export declare function timescaleExporter(client: pg.Client, timestamp: number, metricName: string, hist: Histogram): Promise<any>;
