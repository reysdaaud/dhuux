"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    STATIC_STALETIME_MS: null,
    createSeededPrefetchCacheEntry: null,
    getOrCreatePrefetchCacheEntry: null,
    prunePrefetchCache: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    STATIC_STALETIME_MS: function() {
        return STATIC_STALETIME_MS;
    },
    createSeededPrefetchCacheEntry: function() {
        return createSeededPrefetchCacheEntry;
    },
    getOrCreatePrefetchCacheEntry: function() {
        return getOrCreatePrefetchCacheEntry;
    },
    prunePrefetchCache: function() {
        return prunePrefetchCache;
    }
});
const _fetchserverresponse = require("./fetch-server-response");
const _routerreducertypes = require("./router-reducer-types");
const _prefetchreducer = require("./reducers/prefetch-reducer");
const INTERCEPTION_CACHE_KEY_MARKER = '%';
/**
 * Creates a cache key for the router prefetch cache
 *
 * @param url - The URL being navigated to
 * @param nextUrl - an internal URL, primarily used for handling rewrites. Defaults to '/'.
 * @return The generated prefetch cache key.
 */ function createPrefetchCacheKeyImpl(url, includeSearchParams, prefix) {
    // Initially we only use the pathname as the cache key. We don't want to include
    // search params so that multiple URLs with the same search parameter can re-use
    // loading states.
    let pathnameFromUrl = url.pathname;
    // RSC responses can differ based on search params, specifically in the case where we aren't
    // returning a partial response (ie with `PrefetchKind.AUTO`).
    // In the auto case, since loading.js & layout.js won't have access to search params,
    // we can safely re-use that cache entry. But for full prefetches, we should not
    // re-use the cache entry as the response may differ.
    if (includeSearchParams) {
        // if we have a full prefetch, we can include the search param in the key,
        // as we'll be getting back a full response. The server might have read the search
        // params when generating the full response.
        pathnameFromUrl += url.search;
    }
    if (prefix) {
        return "" + prefix + INTERCEPTION_CACHE_KEY_MARKER + pathnameFromUrl;
    }
    return pathnameFromUrl;
}
function createPrefetchCacheKey(url, kind, nextUrl) {
    return createPrefetchCacheKeyImpl(url, kind === _routerreducertypes.PrefetchKind.FULL, nextUrl);
}
function getExistingCacheEntry(url, kind, nextUrl, prefetchCache, allowAliasing) {
    if (kind === void 0) kind = _routerreducertypes.PrefetchKind.TEMPORARY;
    // We first check if there's a more specific interception route prefetch entry
    // This is because when we detect a prefetch that corresponds with an interception route, we prefix it with nextUrl (see `createPrefetchCacheKey`)
    // to avoid conflicts with other pages that may have the same URL but render different things depending on the `Next-URL` header.
    for (const maybeNextUrl of [
        nextUrl,
        null
    ]){
        const cacheKeyWithParams = createPrefetchCacheKeyImpl(url, true, maybeNextUrl);
        const cacheKeyWithoutParams = createPrefetchCacheKeyImpl(url, false, maybeNextUrl);
        // First, we check if we have a cache entry that exactly matches the URL
        const cacheKeyToUse = url.search ? cacheKeyWithParams : cacheKeyWithoutParams;
        const existingEntry = prefetchCache.get(cacheKeyToUse);
        if (existingEntry && allowAliasing) {
            // We know we're returning an aliased entry when the pathname matches but the search params don't,
            const isAliased = existingEntry.url.pathname === url.pathname && existingEntry.url.search !== url.search;
            if (isAliased) {
                return {
                    ...existingEntry,
                    aliased: true
                };
            }
            return existingEntry;
        }
        // If the request contains search params, and we're not doing a full prefetch, we can return the
        // param-less entry if it exists.
        // This is technically covered by the check at the bottom of this function, which iterates over cache entries,
        // but lets us arrive there quicker in the param-full case.
        const entryWithoutParams = prefetchCache.get(cacheKeyWithoutParams);
        if (process.env.NODE_ENV !== 'development' && allowAliasing && url.search && kind !== _routerreducertypes.PrefetchKind.FULL && entryWithoutParams && // We shouldn't return the aliased entry if it was relocated to a new cache key.
        // Since it's rewritten, it could respond with a completely different loading state.
        !entryWithoutParams.key.includes(INTERCEPTION_CACHE_KEY_MARKER)) {
            return {
                ...entryWithoutParams,
                aliased: true
            };
        }
    }
    // If we've gotten to this point, we didn't find a specific cache entry that matched
    // the request URL.
    // We attempt a partial match by checking if there's a cache entry with the same pathname.
    // Regardless of what we find, since it doesn't correspond with the requested URL, we'll mark it "aliased".
    // This will signal to the router that it should only apply the loading state on the prefetched data.
    if (process.env.NODE_ENV !== 'development' && kind !== _routerreducertypes.PrefetchKind.FULL && allowAliasing) {
        for (const cacheEntry of prefetchCache.values()){
            if (cacheEntry.url.pathname === url.pathname && // We shouldn't return the aliased entry if it was relocated to a new cache key.
            // Since it's rewritten, it could respond with a completely different loading state.
            !cacheEntry.key.includes(INTERCEPTION_CACHE_KEY_MARKER)) {
                return {
                    ...cacheEntry,
                    aliased: true
                };
            }
        }
    }
    return undefined;
}
function getOrCreatePrefetchCacheEntry(param) {
    let { url, nextUrl, tree, prefetchCache, kind, allowAliasing = true } = param;
    const existingCacheEntry = getExistingCacheEntry(url, kind, nextUrl, prefetchCache, allowAliasing);
    if (existingCacheEntry) {
        // Grab the latest status of the cache entry and update it
        existingCacheEntry.status = getPrefetchEntryCacheStatus(existingCacheEntry);
        // when `kind` is provided, an explicit prefetch was requested.
        // if the requested prefetch is "full" and the current cache entry wasn't, we want to re-prefetch with the new intent
        const switchedToFullPrefetch = existingCacheEntry.kind !== _routerreducertypes.PrefetchKind.FULL && kind === _routerreducertypes.PrefetchKind.FULL;
        if (switchedToFullPrefetch) {
            // If we switched to a full prefetch, validate that the existing cache entry contained partial data.
            // It's possible that the cache entry was seeded with full data but has a cache type of "auto" (ie when cache entries
            // are seeded but without a prefetch intent)
            existingCacheEntry.data.then((prefetchResponse)=>{
                const isFullPrefetch = Array.isArray(prefetchResponse.flightData) && prefetchResponse.flightData.some((flightData)=>{
                    // If we started rendering from the root and we returned RSC data (seedData), we already had a full prefetch.
                    return flightData.isRootRender && flightData.seedData !== null;
                });
                if (!isFullPrefetch) {
                    return createLazyPrefetchEntry({
                        tree,
                        url,
                        nextUrl,
                        prefetchCache,
                        // If we didn't get an explicit prefetch kind, we want to set a temporary kind
                        // rather than assuming the same intent as the previous entry, to be consistent with how we
                        // lazily create prefetch entries when intent is left unspecified.
                        kind: kind != null ? kind : _routerreducertypes.PrefetchKind.TEMPORARY
                    });
                }
            });
        }
        // If the existing cache entry was marked as temporary, it means it was lazily created when attempting to get an entry,
        // where we didn't have the prefetch intent. Now that we have the intent (in `kind`), we want to update the entry to the more accurate kind.
        if (kind && existingCacheEntry.kind === _routerreducertypes.PrefetchKind.TEMPORARY) {
            existingCacheEntry.kind = kind;
        }
        // We've determined that the existing entry we found is still valid, so we return it.
        return existingCacheEntry;
    }
    // If we didn't return an entry, create a new one.
    return createLazyPrefetchEntry({
        tree,
        url,
        nextUrl,
        prefetchCache,
        kind: kind || _routerreducertypes.PrefetchKind.TEMPORARY
    });
}
/*
 * Used to take an existing cache entry and prefix it with the nextUrl, if it exists.
 * This ensures that we don't have conflicting cache entries for the same URL (as is the case with route interception).
 */ function prefixExistingPrefetchCacheEntry(param) {
    let { url, nextUrl, prefetchCache, existingCacheKey } = param;
    const existingCacheEntry = prefetchCache.get(existingCacheKey);
    if (!existingCacheEntry) {
        // no-op -- there wasn't an entry to move
        return;
    }
    const newCacheKey = createPrefetchCacheKey(url, existingCacheEntry.kind, nextUrl);
    prefetchCache.set(newCacheKey, {
        ...existingCacheEntry,
        key: newCacheKey
    });
    prefetchCache.delete(existingCacheKey);
    return newCacheKey;
}
function createSeededPrefetchCacheEntry(param) {
    let { nextUrl, tree, prefetchCache, url, data, kind } = param;
    // The initial cache entry technically includes full data, but it isn't explicitly prefetched -- we just seed the
    // prefetch cache so that we can skip an extra prefetch request later, since we already have the data.
    // if the prefetch corresponds with an interception route, we use the nextUrl to prefix the cache key
    const prefetchCacheKey = data.couldBeIntercepted ? createPrefetchCacheKey(url, kind, nextUrl) : createPrefetchCacheKey(url, kind);
    const prefetchEntry = {
        treeAtTimeOfPrefetch: tree,
        data: Promise.resolve(data),
        kind,
        prefetchTime: Date.now(),
        lastUsedTime: Date.now(),
        staleTime: -1,
        key: prefetchCacheKey,
        status: _routerreducertypes.PrefetchCacheEntryStatus.fresh,
        url
    };
    prefetchCache.set(prefetchCacheKey, prefetchEntry);
    return prefetchEntry;
}
/**
 * Creates a prefetch entry entry and enqueues a fetch request to retrieve the data.
 */ function createLazyPrefetchEntry(param) {
    let { url, kind, tree, nextUrl, prefetchCache } = param;
    const prefetchCacheKey = createPrefetchCacheKey(url, kind);
    // initiates the fetch request for the prefetch and attaches a listener
    // to the promise to update the prefetch cache entry when the promise resolves (if necessary)
    const data = _prefetchreducer.prefetchQueue.enqueue(()=>(0, _fetchserverresponse.fetchServerResponse)(url, {
            flightRouterState: tree,
            nextUrl,
            prefetchKind: kind
        }).then((prefetchResponse)=>{
            // TODO: `fetchServerResponse` should be more tighly coupled to these prefetch cache operations
            // to avoid drift between this cache key prefixing logic
            // (which is currently directly influenced by the server response)
            let newCacheKey;
            if (prefetchResponse.couldBeIntercepted) {
                // Determine if we need to prefix the cache key with the nextUrl
                newCacheKey = prefixExistingPrefetchCacheEntry({
                    url,
                    existingCacheKey: prefetchCacheKey,
                    nextUrl,
                    prefetchCache
                });
            }
            // If the prefetch was a cache hit, we want to update the existing cache entry to reflect that it was a full prefetch.
            // This is because we know that a static response will contain the full RSC payload, and can be updated to respect the `static`
            // staleTime.
            if (prefetchResponse.prerendered) {
                const existingCacheEntry = prefetchCache.get(// if we prefixed the cache key due to route interception, we want to use the new key. Otherwise we use the original key
                newCacheKey != null ? newCacheKey : prefetchCacheKey);
                if (existingCacheEntry) {
                    existingCacheEntry.kind = _routerreducertypes.PrefetchKind.FULL;
                    if (prefetchResponse.staleTime !== -1) {
                        // This is the stale time that was collected by the server during
                        // static generation. Use this in place of the default stale time.
                        existingCacheEntry.staleTime = prefetchResponse.staleTime;
                    }
                }
            }
            return prefetchResponse;
        }));
    const prefetchEntry = {
        treeAtTimeOfPrefetch: tree,
        data,
        kind,
        prefetchTime: Date.now(),
        lastUsedTime: null,
        staleTime: -1,
        key: prefetchCacheKey,
        status: _routerreducertypes.PrefetchCacheEntryStatus.fresh,
        url
    };
    prefetchCache.set(prefetchCacheKey, prefetchEntry);
    return prefetchEntry;
}
function prunePrefetchCache(prefetchCache) {
    for (const [href, prefetchCacheEntry] of prefetchCache){
        if (getPrefetchEntryCacheStatus(prefetchCacheEntry) === _routerreducertypes.PrefetchCacheEntryStatus.expired) {
            prefetchCache.delete(href);
        }
    }
}
// These values are set by `define-env-plugin` (based on `nextConfig.experimental.staleTimes`)
// and default to 5 minutes (static) / 0 seconds (dynamic)
const DYNAMIC_STALETIME_MS = Number(process.env.__NEXT_CLIENT_ROUTER_DYNAMIC_STALETIME) * 1000;
const STATIC_STALETIME_MS = Number(process.env.__NEXT_CLIENT_ROUTER_STATIC_STALETIME) * 1000;
function getPrefetchEntryCacheStatus(param) {
    let { kind, prefetchTime, lastUsedTime, staleTime } = param;
    if (staleTime !== -1) {
        // `staleTime` is the value sent by the server during static generation.
        // When this is available, it takes precedence over any of the heuristics
        // that follow.
        //
        // TODO: When PPR is enabled, the server will *always* return a stale time
        // when prefetching. We should never use a prefetch entry that hasn't yet
        // received data from the server. So the only two cases should be 1) we use
        // the server-generated stale time 2) the unresolved entry is discarded.
        return Date.now() < prefetchTime + staleTime ? _routerreducertypes.PrefetchCacheEntryStatus.fresh : _routerreducertypes.PrefetchCacheEntryStatus.stale;
    }
    // We will re-use the cache entry data for up to the `dynamic` staletime window.
    if (Date.now() < (lastUsedTime != null ? lastUsedTime : prefetchTime) + DYNAMIC_STALETIME_MS) {
        return lastUsedTime ? _routerreducertypes.PrefetchCacheEntryStatus.reusable : _routerreducertypes.PrefetchCacheEntryStatus.fresh;
    }
    // For "auto" prefetching, we'll re-use only the loading boundary for up to `static` staletime window.
    // A stale entry will only re-use the `loading` boundary, not the full data.
    // This will trigger a "lazy fetch" for the full data.
    if (kind === _routerreducertypes.PrefetchKind.AUTO) {
        if (Date.now() < prefetchTime + STATIC_STALETIME_MS) {
            return _routerreducertypes.PrefetchCacheEntryStatus.stale;
        }
    }
    // for "full" prefetching, we'll re-use the cache entry data for up to `static` staletime window.
    if (kind === _routerreducertypes.PrefetchKind.FULL) {
        if (Date.now() < prefetchTime + STATIC_STALETIME_MS) {
            return _routerreducertypes.PrefetchCacheEntryStatus.reusable;
        }
    }
    return _routerreducertypes.PrefetchCacheEntryStatus.expired;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=prefetch-cache-utils.js.map