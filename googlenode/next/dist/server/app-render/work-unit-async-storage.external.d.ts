import type { AsyncLocalStorage } from 'async_hooks';
import type { DraftModeProvider } from '../async-storage/draft-mode-provider';
import type { ResponseCookies } from '../web/spec-extension/cookies';
import type { ReadonlyHeaders } from '../web/spec-extension/adapters/headers';
import type { ReadonlyRequestCookies } from '../web/spec-extension/adapters/request-cookies';
import type { CacheSignal } from './cache-signal';
import type { DynamicTrackingState } from './dynamic-rendering';
import { workUnitAsyncStorageInstance } from './work-unit-async-storage-instance';
import type { ServerComponentsHmrCache } from '../response-cache';
import type { RenderResumeDataCache, PrerenderResumeDataCache } from '../resume-data-cache/resume-data-cache';
import type { Params } from '../request/params';
type WorkUnitPhase = 'action' | 'render' | 'after';
type PhasePartial = {
    /** NOTE: Will be mutated as phases change */
    phase: WorkUnitPhase;
};
export type RequestStore = {
    type: 'request';
    /**
     * The URL of the request. This only specifies the pathname and the search
     * part of the URL.
     */
    readonly url: {
        /**
         * The pathname of the requested URL.
         */
        readonly pathname: string;
        /**
         * The search part of the requested URL. If the request did not provide a
         * search part, this will be an empty string.
         */
        readonly search: string;
    };
    readonly headers: ReadonlyHeaders;
    cookies: ReadonlyRequestCookies;
    readonly mutableCookies: ResponseCookies;
    readonly userspaceMutableCookies: ResponseCookies;
    readonly draftMode: DraftModeProvider;
    readonly isHmrRefresh?: boolean;
    readonly serverComponentsHmrCache?: ServerComponentsHmrCache;
    readonly implicitTags: string[];
    readonly rootParams: Params;
    /**
     * The resume data cache for this request. This will be a immutable cache.
     */
    renderResumeDataCache: RenderResumeDataCache | null;
    usedDynamic?: boolean;
    prerenderPhase?: boolean;
} & PhasePartial;
/**
 * The Prerender store is for tracking information related to prerenders.
 *
 * It can be used for both RSC and SSR prerendering and should be scoped as close
 * to the individual `renderTo...` API call as possible. To keep the type simple
 * we don't distinguish between RSC and SSR prerendering explicitly but instead
 * use conditional object properties to infer which mode we are in. For instance cache tracking
 * only needs to happen during the RSC prerender when we are prospectively prerendering
 * to fill all caches.
 */
export type PrerenderStoreModern = {
    type: 'prerender';
    readonly implicitTags: string[];
    /**
     * This signal is aborted when the React render is complete. (i.e. it is the same signal passed to react)
     */
    readonly renderSignal: AbortSignal;
    /**
     * This is the AbortController which represents the boundary between Prerender and dynamic. In some renders it is
     * the same as the controller for the renderSignal but in others it is a separate controller. It should be aborted
     * whenever the we are no longer in the prerender phase of rendering. Typically this is after one task or when you call
     * a sync API which requires the prerender to end immediately
     */
    readonly controller: AbortController;
    /**
     * when not null this signal is used to track cache reads during prerendering and
     * to await all cache reads completing before aborting the prerender.
     */
    readonly cacheSignal: null | CacheSignal;
    /**
     * During some prerenders we want to track dynamic access.
     */
    readonly dynamicTracking: null | DynamicTrackingState;
    readonly rootParams: Params;
    revalidate: number;
    expire: number;
    stale: number;
    tags: null | string[];
    /**
     * The resume data cache for this prerender.
     */
    prerenderResumeDataCache: PrerenderResumeDataCache | null;
    validating?: boolean;
} & PhasePartial;
export type PrerenderStorePPR = {
    type: 'prerender-ppr';
    readonly rootParams: Params;
    readonly implicitTags: string[];
    readonly dynamicTracking: null | DynamicTrackingState;
    revalidate: number;
    expire: number;
    stale: number;
    tags: null | string[];
    /**
     * The resume data cache for this prerender.
     */
    prerenderResumeDataCache: PrerenderResumeDataCache;
} & PhasePartial;
export type PrerenderStoreLegacy = {
    type: 'prerender-legacy';
    readonly rootParams: Params;
    readonly implicitTags: string[];
    revalidate: number;
    expire: number;
    stale: number;
    tags: null | string[];
} & PhasePartial;
export type PrerenderStore = PrerenderStoreLegacy | PrerenderStorePPR | PrerenderStoreModern;
export type UseCacheStore = {
    type: 'cache';
    readonly implicitTags: string[];
    revalidate: number;
    expire: number;
    stale: number;
    explicitRevalidate: undefined | number;
    explicitExpire: undefined | number;
    explicitStale: undefined | number;
    tags: null | string[];
    readonly hmrRefreshHash: string | undefined;
    readonly isHmrRefresh: boolean;
    readonly serverComponentsHmrCache: ServerComponentsHmrCache | undefined;
    readonly forceRevalidate: boolean;
} & PhasePartial;
export type UnstableCacheStore = {
    type: 'unstable-cache';
} & PhasePartial;
/**
 * The Cache store is for tracking information inside a "use cache" or unstable_cache context.
 * Inside this context we should never expose any request or page specific information.
 */
export type CacheStore = UseCacheStore | UnstableCacheStore;
export type WorkUnitStore = RequestStore | CacheStore | PrerenderStore;
export type WorkUnitAsyncStorage = AsyncLocalStorage<WorkUnitStore>;
export { workUnitAsyncStorageInstance as workUnitAsyncStorage };
export declare function getExpectedRequestStore(callingExpression: string): RequestStore;
export declare function getPrerenderResumeDataCache(workUnitStore: WorkUnitStore): PrerenderResumeDataCache | null;
export declare function getRenderResumeDataCache(workUnitStore: WorkUnitStore): RenderResumeDataCache | null;
export declare function getHmrRefreshHash(workUnitStore: WorkUnitStore): string | undefined;
