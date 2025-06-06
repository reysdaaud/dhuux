import { AppPageRouteModule } from '../../server/route-modules/app-page/module.compiled' with {
    'turbopack-transition': 'next-ssr'
};
import { RouteKind } from '../../server/route-kind' with {
    'turbopack-transition': 'next-server-utility'
};
// We inject the tree and pages here so that we can use them in the route
// module.
// INJECT:tree
// INJECT:pages
export { tree, pages };
export { default as GlobalError } from 'VAR_MODULE_GLOBAL_ERROR' with {
    'turbopack-transition': 'next-server-utility'
};
// INJECT:__next_app_require__
// INJECT:__next_app_load_chunk__
export const __next_app__ = {
    require: __next_app_require__,
    loadChunk: __next_app_load_chunk__
};
export * from '../../server/app-render/entry-base' with {
    'turbopack-transition': 'next-server-utility'
};
// Create and export the route module that will be consumed.
export const routeModule = new AppPageRouteModule({
    definition: {
        kind: RouteKind.APP_PAGE,
        page: 'VAR_DEFINITION_PAGE',
        pathname: 'VAR_DEFINITION_PATHNAME',
        // The following aren't used in production.
        bundlePath: '',
        filename: '',
        appPaths: []
    },
    userland: {
        loaderTree: tree
    }
});

//# sourceMappingURL=app-page.js.map