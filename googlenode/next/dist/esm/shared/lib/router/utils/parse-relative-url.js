import { getLocationOrigin } from '../../utils';
import { searchParamsToUrlQuery } from './querystring';
export function parseRelativeUrl(url, base, parseQuery) {
    if (parseQuery === void 0) parseQuery = true;
    const globalBase = new URL(typeof window === 'undefined' ? 'http://n' : getLocationOrigin());
    const resolvedBase = base ? new URL(base, globalBase) : url.startsWith('.') ? new URL(typeof window === 'undefined' ? 'http://n' : window.location.href) : globalBase;
    const { pathname, searchParams, search, hash, href, origin } = new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw Object.defineProperty(new Error("invariant: invalid relative URL, router received " + url), "__NEXT_ERROR_CODE", {
            value: "E159",
            enumerable: false,
            configurable: true
        });
    }
    return {
        pathname,
        query: parseQuery ? searchParamsToUrlQuery(searchParams) : undefined,
        search,
        hash,
        href: href.slice(origin.length)
    };
}

//# sourceMappingURL=parse-relative-url.js.map