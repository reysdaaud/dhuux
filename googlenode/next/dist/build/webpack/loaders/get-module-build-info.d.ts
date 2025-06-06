import type { MiddlewareConfig, MiddlewareMatcher, RSCModuleType } from '../../analysis/get-page-static-info';
import type { webpack } from 'next/dist/compiled/webpack/webpack';
export type ModuleBuildInfo = {
    nextEdgeMiddleware?: EdgeMiddlewareMeta;
    nextEdgeApiFunction?: EdgeMiddlewareMeta;
    nextEdgeSSR?: EdgeSSRMeta;
    nextWasmMiddlewareBinding?: AssetBinding;
    nextAssetMiddlewareBinding?: AssetBinding;
    usingIndirectEval?: boolean | Set<string>;
    route?: RouteMeta;
    importLocByPath?: Map<string, any>;
    rootDir?: string;
    rsc?: RSCMeta;
};
/**
 * A getter for module build info that casts to the type it should have.
 * We also expose here types to make easier to use it.
 */
export declare function getModuleBuildInfo(webpackModule: webpack.Module): ModuleBuildInfo;
export interface RSCMeta {
    type: RSCModuleType;
    actionIds?: Record<string, string>;
    clientRefs?: string[];
    clientEntryType?: 'cjs' | 'auto';
    isClientRef?: boolean;
    requests?: string[];
}
export interface RouteMeta {
    page: string;
    absolutePagePath: string;
    preferredRegion: string | string[] | undefined;
    middlewareConfig: MiddlewareConfig;
    relatedModules?: string[];
}
export interface EdgeMiddlewareMeta {
    page: string;
    matchers?: MiddlewareMatcher[];
}
export interface EdgeSSRMeta {
    isServerComponent: boolean;
    isAppDir?: boolean;
    page: string;
}
export interface AssetBinding {
    filePath: string;
    name: string;
}
