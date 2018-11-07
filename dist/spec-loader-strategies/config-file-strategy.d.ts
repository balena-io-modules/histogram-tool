import { PercentileSpec } from '..';
interface ConfigFileStrategyOptions {
    file: string;
}
export declare let ConfigFileStrategy: {
    load: (options: ConfigFileStrategyOptions) => PercentileSpec;
};
export {};
