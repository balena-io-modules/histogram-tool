import { BinSpec, PercentileSpec } from '..';
interface ConfigFileStrategyOptions {
    file: string;
}
export declare const ConfigFileStrategy: {
    loadPercentileSpec: (options: ConfigFileStrategyOptions) => PercentileSpec;
    loadBinSpec: (options: ConfigFileStrategyOptions) => BinSpec;
};
export {};
