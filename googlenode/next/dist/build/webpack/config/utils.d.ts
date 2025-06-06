import type { webpack } from 'next/dist/compiled/webpack/webpack';
import type { NextConfigComplete } from '../../../server/config-shared';
export type ConfigurationContext = {
    hasAppDir: boolean;
    isAppDir?: boolean;
    supportedBrowsers: string[] | undefined;
    rootDirectory: string;
    customAppFile: RegExp | undefined;
    isDevelopment: boolean;
    isProduction: boolean;
    isServer: boolean;
    isClient: boolean;
    isEdgeRuntime: boolean;
    targetWeb: boolean;
    assetPrefix: string;
    sassOptions: any;
    productionBrowserSourceMaps: boolean;
    serverSourceMaps: boolean;
    transpilePackages: NextConfigComplete['transpilePackages'];
    future: NextConfigComplete['future'];
    experimental: NextConfigComplete['experimental'];
};
export type ConfigurationFn = (a: webpack.Configuration) => webpack.Configuration;
export declare const pipe: <R>(...fns: Array<(a: R) => R | Promise<R>>) => (param: R) => R | Promise<R>;
