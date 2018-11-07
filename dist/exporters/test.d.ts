interface Exportable {
    doExport(...args: any[]): Promise<any>;
}
declare class APIMetricsBundle implements Exportable {
    x: number;
    constructor(x: number);
    static create: () => APIMetricsBundle;
    doExport(msg: string): Promise<any>;
}
declare let a: APIMetricsBundle;
declare let c: APIMetricsBundle;
