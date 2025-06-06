/**
 * A shared cache of cache controls for routes. This cache is used so we don't
 * have to modify the prerender manifest when we want to update the cache
 * control for a route.
 */ export class SharedCacheControls {
    static #_ = /**
   * The in-memory cache of cache lives for routes. This cache is populated when
   * the cache is updated with new cache lives.
   */ this.cacheControls = new Map();
    constructor(/**
     * The prerender manifest that contains the initial cache controls for
     * routes.
     */ prerenderManifest){
        this.prerenderManifest = prerenderManifest;
    }
    /**
   * Try to get the cache control value for a route. This will first try to get
   * the value from the in-memory cache. If the value is not present in the
   * in-memory cache, it will be sourced from the prerender manifest.
   *
   * @param route the route to get the cache control for
   * @returns the cache control for the route, or undefined if the values
   *          are not present in the in-memory cache or the prerender manifest
   */ get(route) {
        // This is a copy on write cache that is updated when the cache is updated.
        // If the cache is never written to, then the values will be sourced from
        // the prerender manifest.
        let cacheControl = SharedCacheControls.cacheControls.get(route);
        if (cacheControl) return cacheControl;
        let prerenderData = this.prerenderManifest.routes[route];
        if (prerenderData) {
            const { initialRevalidateSeconds, initialExpireSeconds } = prerenderData;
            if (typeof initialRevalidateSeconds !== 'undefined') {
                return {
                    revalidate: initialRevalidateSeconds,
                    expire: initialExpireSeconds
                };
            }
        }
        const dynamicPrerenderData = this.prerenderManifest.dynamicRoutes[route];
        if (dynamicPrerenderData) {
            const { fallbackRevalidate, fallbackExpire } = dynamicPrerenderData;
            if (typeof fallbackRevalidate !== 'undefined') {
                return {
                    revalidate: fallbackRevalidate,
                    expire: fallbackExpire
                };
            }
        }
        return undefined;
    }
    /**
   * Set the cache control for a route.
   *
   * @param route the route to set the cache control for
   * @param cacheControl the cache control for the route
   */ set(route, cacheControl) {
        SharedCacheControls.cacheControls.set(route, cacheControl);
    }
    /**
   * Clear the in-memory cache of cache controls for routes.
   */ clear() {
        SharedCacheControls.cacheControls.clear();
    }
}

//# sourceMappingURL=shared-cache-controls.js.map