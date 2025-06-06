import { stringify } from 'querystring';
import { getModuleBuildInfo } from '../get-module-build-info';
import { RouteKind } from '../../../../server/route-kind';
import { normalizePagePath } from '../../../../shared/lib/page-path/normalize-page-path';
import { decodeFromBase64, encodeToBase64 } from '../utils';
import { isInstrumentationHookFile } from '../../../utils';
import { loadEntrypoint } from '../../../load-entrypoint';
/**
 * Returns the loader entry for a given page.
 *
 * @param options the options to create the loader entry
 * @returns the encoded loader entry
 */ export function getRouteLoaderEntry(options) {
    switch(options.kind){
        case RouteKind.PAGES:
            {
                const query = {
                    kind: options.kind,
                    page: options.page,
                    preferredRegion: options.preferredRegion,
                    absolutePagePath: options.absolutePagePath,
                    // These are the path references to the internal components that may be
                    // overridden by userland components.
                    absoluteAppPath: options.pages['/_app'],
                    absoluteDocumentPath: options.pages['/_document'],
                    middlewareConfigBase64: encodeToBase64(options.middlewareConfig)
                };
                return `next-route-loader?${stringify(query)}!`;
            }
        case RouteKind.PAGES_API:
            {
                const query = {
                    kind: options.kind,
                    page: options.page,
                    preferredRegion: options.preferredRegion,
                    absolutePagePath: options.absolutePagePath,
                    middlewareConfigBase64: encodeToBase64(options.middlewareConfig)
                };
                return `next-route-loader?${stringify(query)}!`;
            }
        default:
            {
                throw Object.defineProperty(new Error('Invariant: Unexpected route kind'), "__NEXT_ERROR_CODE", {
                    value: "E453",
                    enumerable: false,
                    configurable: true
                });
            }
    }
}
const loadPages = async ({ page, absolutePagePath, absoluteDocumentPath, absoluteAppPath, preferredRegion, middlewareConfigBase64 }, buildInfo)=>{
    const middlewareConfig = decodeFromBase64(middlewareConfigBase64);
    // Attach build info to the module.
    buildInfo.route = {
        page,
        absolutePagePath,
        preferredRegion,
        middlewareConfig
    };
    let file = await loadEntrypoint('pages', {
        VAR_USERLAND: absolutePagePath,
        VAR_MODULE_DOCUMENT: absoluteDocumentPath,
        VAR_MODULE_APP: absoluteAppPath,
        VAR_DEFINITION_PAGE: normalizePagePath(page),
        VAR_DEFINITION_PATHNAME: page
    });
    if (isInstrumentationHookFile(page)) {
        // When we're building the instrumentation page (only when the
        // instrumentation file conflicts with a page also labeled
        // /instrumentation) hoist the `register` method.
        file += '\nexport const register = hoist(userland, "register")';
    }
    return file;
};
const loadPagesAPI = async ({ page, absolutePagePath, preferredRegion, middlewareConfigBase64 }, buildInfo)=>{
    const middlewareConfig = decodeFromBase64(middlewareConfigBase64);
    // Attach build info to the module.
    buildInfo.route = {
        page,
        absolutePagePath,
        preferredRegion,
        middlewareConfig
    };
    return await loadEntrypoint('pages-api', {
        VAR_USERLAND: absolutePagePath,
        VAR_DEFINITION_PAGE: normalizePagePath(page),
        VAR_DEFINITION_PATHNAME: page
    });
};
/**
 * Handles the `next-route-loader` options.
 * @returns the loader definition function
 */ const loader = async function() {
    if (!this._module) {
        throw Object.defineProperty(new Error('Invariant: expected this to reference a module'), "__NEXT_ERROR_CODE", {
            value: "E383",
            enumerable: false,
            configurable: true
        });
    }
    const buildInfo = getModuleBuildInfo(this._module);
    const opts = this.getOptions();
    switch(opts.kind){
        case RouteKind.PAGES:
            {
                return await loadPages(opts, buildInfo);
            }
        case RouteKind.PAGES_API:
            {
                return await loadPagesAPI(opts, buildInfo);
            }
        default:
            {
                throw Object.defineProperty(new Error('Invariant: Unexpected route kind'), "__NEXT_ERROR_CODE", {
                    value: "E453",
                    enumerable: false,
                    configurable: true
                });
            }
    }
};
export default loader;

//# sourceMappingURL=index.js.map