import type { ServerFields, SetupOpts } from '../lib/router-utils/setup-dev-bundler';
import type { Issue, TurbopackResult, Endpoint, RawEntrypoints, Update as TurbopackUpdate, WrittenEndpoint } from '../../build/swc/types';
import { type HMR_ACTION_TYPES } from './hot-reloader-types';
import type { PropagateToWorkersField } from '../lib/router-utils/types';
import type { TurbopackManifestLoader } from '../../shared/lib/turbopack/manifest-loader';
import type { AppRoute, Entrypoints, PageRoute } from '../../build/swc/types';
import { type EntryKey } from '../../shared/lib/turbopack/entry-key';
import type ws from 'next/dist/compiled/ws';
import type { CustomRoutes } from '../../lib/load-custom-routes';
import { type EntryIssuesMap, type TopLevelIssuesMap } from '../../shared/lib/turbopack/utils';
export declare function printNonFatalIssue(issue: Issue): void;
export declare function processTopLevelIssues(currentTopLevelIssues: TopLevelIssuesMap, result: TurbopackResult): void;
export declare function msToNs(ms: number): bigint;
export type ChangeSubscriptions = Map<EntryKey, Promise<AsyncIterableIterator<TurbopackResult>>>;
export type HandleWrittenEndpoint = (key: EntryKey, result: TurbopackResult<WrittenEndpoint>) => void;
export type StartChangeSubscription = (key: EntryKey, includeIssues: boolean, endpoint: Endpoint, makePayload: (change: TurbopackResult, hash: string) => Promise<HMR_ACTION_TYPES> | HMR_ACTION_TYPES | void, onError?: (e: Error) => Promise<HMR_ACTION_TYPES> | HMR_ACTION_TYPES | void) => Promise<void>;
export type StopChangeSubscription = (key: EntryKey) => Promise<void>;
export type SendHmr = (id: string, payload: HMR_ACTION_TYPES) => void;
export type StartBuilding = (id: string, requestUrl: string | undefined, forceRebuild: boolean) => () => void;
export type ReadyIds = Set<string>;
export type ClientState = {
    clientIssues: EntryIssuesMap;
    hmrPayloads: Map<string, HMR_ACTION_TYPES>;
    turbopackUpdates: TurbopackUpdate[];
    subscriptions: Map<string, AsyncIterator<any>>;
};
export type ClientStateMap = WeakMap<ws, ClientState>;
type HandleRouteTypeHooks = {
    handleWrittenEndpoint: HandleWrittenEndpoint;
    subscribeToChanges: StartChangeSubscription;
};
export declare function handleRouteType({ dev, page, pathname, route, currentEntryIssues, entrypoints, manifestLoader, readyIds, devRewrites, productionRewrites, hooks, logErrors, }: {
    dev: boolean;
    page: string;
    pathname: string;
    route: PageRoute | AppRoute;
    currentEntryIssues: EntryIssuesMap;
    entrypoints: Entrypoints;
    manifestLoader: TurbopackManifestLoader;
    devRewrites: SetupOpts['fsChecker']['rewrites'] | undefined;
    productionRewrites: CustomRoutes['rewrites'] | undefined;
    logErrors: boolean;
    readyIds?: ReadyIds;
    hooks?: HandleRouteTypeHooks;
}): Promise<void>;
/**
 * Maintains a mapping between entrypoins and the corresponding client asset paths.
 */
export declare class AssetMapper {
    private entryMap;
    private assetMap;
    /**
     * Overrides asset paths for a key and updates the mapping from path to key.
     *
     * @param key
     * @param assetPaths asset paths relative to the .next directory
     */
    setPathsForKey(key: EntryKey, assetPaths: string[]): void;
    /**
     * Deletes the key and any asset only referenced by this key.
     *
     * @param key
     */
    delete(key: EntryKey): void;
    getAssetPathsByKey(key: EntryKey): string[];
    getKeysByAsset(path: string): EntryKey[];
    keys(): IterableIterator<EntryKey>;
}
export declare function hasEntrypointForKey(entrypoints: Entrypoints, key: EntryKey, assetMapper: AssetMapper | undefined): boolean;
type HandleEntrypointsHooks = {
    handleWrittenEndpoint: HandleWrittenEndpoint;
    propagateServerField: (field: PropagateToWorkersField, args: any) => Promise<void>;
    sendHmr: SendHmr;
    startBuilding: StartBuilding;
    subscribeToChanges: StartChangeSubscription;
    unsubscribeFromChanges: StopChangeSubscription;
    unsubscribeFromHmrEvents: (client: ws, id: string) => void;
};
type HandleEntrypointsDevOpts = {
    assetMapper: AssetMapper;
    changeSubscriptions: ChangeSubscriptions;
    clients: Set<ws>;
    clientStates: ClientStateMap;
    serverFields: ServerFields;
    hooks: HandleEntrypointsHooks;
};
export declare function handleEntrypoints({ entrypoints, currentEntrypoints, currentEntryIssues, manifestLoader, devRewrites, logErrors, dev, }: {
    entrypoints: TurbopackResult<RawEntrypoints>;
    currentEntrypoints: Entrypoints;
    currentEntryIssues: EntryIssuesMap;
    manifestLoader: TurbopackManifestLoader;
    devRewrites: SetupOpts['fsChecker']['rewrites'] | undefined;
    productionRewrites: CustomRoutes['rewrites'] | undefined;
    logErrors: boolean;
    dev: HandleEntrypointsDevOpts;
}): Promise<void>;
export declare function handlePagesErrorRoute({ currentEntryIssues, entrypoints, manifestLoader, devRewrites, productionRewrites, logErrors, hooks, }: {
    currentEntryIssues: EntryIssuesMap;
    entrypoints: Entrypoints;
    manifestLoader: TurbopackManifestLoader;
    devRewrites: SetupOpts['fsChecker']['rewrites'] | undefined;
    productionRewrites: CustomRoutes['rewrites'] | undefined;
    logErrors: boolean;
    hooks: HandleRouteTypeHooks;
}): Promise<void>;
export declare function removeRouteSuffix(route: string): string;
export declare function addRouteSuffix(route: string): string;
export declare function addMetadataIdToRoute(route: string): string;
export declare function normalizedPageToTurbopackStructureRoute(route: string, ext: string | false): string;
export {};
