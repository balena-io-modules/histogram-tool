export interface Percentile {
    p: number;
    x: number;
}
export interface PercentileSpec {
    id: string;
    list: Percentile[];
}
