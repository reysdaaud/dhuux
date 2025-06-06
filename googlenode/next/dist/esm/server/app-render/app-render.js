import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { workAsyncStorage } from '../app-render/work-async-storage.external';
import React from 'react';
import RenderResult from '../render-result';
import { chainStreams, renderToInitialFizzStream, createDocumentClosingStream, continueFizzStream, continueDynamicPrerender, continueStaticPrerender, continueDynamicHTMLResume, streamToBuffer, streamToString } from '../stream-utils/node-web-streams-helper';
import { stripInternalQueries } from '../internal-utils';
import { NEXT_HMR_REFRESH_HEADER, NEXT_ROUTER_PREFETCH_HEADER, NEXT_ROUTER_STATE_TREE_HEADER, NEXT_ROUTER_STALE_TIME_HEADER, NEXT_URL, RSC_HEADER, NEXT_ROUTER_SEGMENT_PREFETCH_HEADER } from '../../client/components/app-router-headers';
import { createTrackedMetadataContext, createMetadataContext } from '../../lib/metadata/metadata-context';
import { createRequestStoreForRender } from '../async-storage/request-store';
import { createWorkStore } from '../async-storage/work-store';
import { getAccessFallbackErrorTypeByStatus, getAccessFallbackHTTPStatus, isHTTPAccessFallbackError } from '../../client/components/http-access-fallback/http-access-fallback';
import { getURLFromRedirectError, getRedirectStatusCodeFromError } from '../../client/components/redirect';
import { isRedirectError } from '../../client/components/redirect-error';
import { getImplicitTags } from '../lib/implicit-tags';
import { AppRenderSpan, NextNodeServerSpan } from '../lib/trace/constants';
import { getTracer } from '../lib/trace/tracer';
import { FlightRenderResult } from './flight-render-result';
import { createFlightReactServerErrorHandler, createHTMLReactServerErrorHandler, createHTMLErrorHandler, isUserLandError, getDigestForWellKnownError } from './create-error-handler';
import { getShortDynamicParamType, dynamicParamTypes } from './get-short-dynamic-param-type';
import { getSegmentParam } from './get-segment-param';
import { getScriptNonceFromHeader } from './get-script-nonce-from-header';
import { parseAndValidateFlightRouterState } from './parse-and-validate-flight-router-state';
import { createFlightRouterStateFromLoaderTree } from './create-flight-router-state-from-loader-tree';
import { handleAction } from './action-handler';
import { isBailoutToCSRError } from '../../shared/lib/lazy-dynamic/bailout-to-csr';
import { warn, error } from '../../build/output/log';
import { appendMutableCookies } from '../web/spec-extension/adapters/request-cookies';
import { createServerInsertedHTML } from './server-inserted-html';
import { getRequiredScripts } from './required-scripts';
import { addPathPrefix } from '../../shared/lib/router/utils/add-path-prefix';
import { makeGetServerInsertedHTML } from './make-get-server-inserted-html';
import { walkTreeWithFlightRouterState } from './walk-tree-with-flight-router-state';
import { createComponentTree, getRootParams } from './create-component-tree';
import { getAssetQueryString } from './get-asset-query-string';
import { setReferenceManifestsSingleton } from './encryption-utils';
import { DynamicState, parsePostponedState } from './postponed-state';
import { getDynamicDataPostponedState, getDynamicHTMLPostponedState, getPostponedFromState } from './postponed-state';
import { isDynamicServerError } from '../../client/components/hooks-server-context';
import { useFlightStream, createInlinedDataReadableStream } from './use-flight-response';
import { StaticGenBailoutError, isStaticGenBailoutError } from '../../client/components/static-generation-bailout';
import { getStackWithoutErrorMessage } from '../../lib/format-server-error';
import { accessedDynamicData, createPostponedAbortSignal, formatDynamicAPIAccesses, isPrerenderInterruptedError, createDynamicTrackingState, createDynamicValidationState, getFirstDynamicReason, trackAllowedDynamicAccess, throwIfDisallowedDynamic, consumeDynamicAccess } from './dynamic-rendering';
import { getClientComponentLoaderMetrics, wrapClientComponentLoader } from '../client-component-renderer-logger';
import { createServerModuleMap } from './action-utils';
import { isNodeNextRequest } from '../base-http/helpers';
import { parseParameter } from '../../shared/lib/router/utils/route-regex';
import { parseRelativeUrl } from '../../shared/lib/router/utils/parse-relative-url';
import AppRouter from '../../client/components/app-router';
import { getServerActionRequestMetadata } from '../lib/server-action-request-meta';
import { createInitialRouterState } from '../../client/components/router-reducer/create-initial-router-state';
import { createMutableActionQueue } from '../../shared/lib/router/action-queue';
import { getRevalidateReason } from '../instrumentation/utils';
import { PAGE_SEGMENT_KEY } from '../../shared/lib/segment';
import { DynamicServerError } from '../../client/components/hooks-server-context';
import { ServerPrerenderStreamResult } from './app-render-prerender-utils';
import { ReactServerResult, createReactServerPrerenderResult, createReactServerPrerenderResultFromRender, prerenderAndAbortInSequentialTasks, prerenderServerWithPhases, prerenderClientWithPhases } from './app-render-prerender-utils';
import { printDebugThrownValueForProspectiveRender } from './prospective-render-utils';
import { scheduleInSequentialTasks } from './app-render-render-utils';
import { waitAtLeastOneReactRenderTask } from '../../lib/scheduler';
import { workUnitAsyncStorage } from './work-unit-async-storage.external';
import { CacheSignal } from './cache-signal';
import { getTracedMetadata } from '../lib/trace/utils';
import { InvariantError } from '../../shared/lib/invariant-error';
import './clean-async-snapshot.external';
import { INFINITE_CACHE } from '../../lib/constants';
import { createComponentStylesAndScripts } from './create-component-styles-and-scripts';
import { parseLoaderTree } from './parse-loader-tree';
import { createPrerenderResumeDataCache, createRenderResumeDataCache } from '../resume-data-cache/resume-data-cache';
import isError from '../../lib/is-error';
import { isUseCacheTimeoutError } from '../use-cache/use-cache-errors';
import { createServerInsertedMetadata } from './metadata-insertion/create-server-inserted-metadata';
const flightDataPathHeadKey = 'h';
function parseRequestHeaders(headers, options) {
    const isDevWarmupRequest = options.isDevWarmup === true;
    // dev warmup requests are treated as prefetch RSC requests
    const isPrefetchRequest = isDevWarmupRequest || headers[NEXT_ROUTER_PREFETCH_HEADER.toLowerCase()] !== undefined;
    const isHmrRefresh = headers[NEXT_HMR_REFRESH_HEADER.toLowerCase()] !== undefined;
    // dev warmup requests are treated as prefetch RSC requests
    const isRSCRequest = isDevWarmupRequest || headers[RSC_HEADER.toLowerCase()] !== undefined;
    const shouldProvideFlightRouterState = isRSCRequest && (!isPrefetchRequest || !options.isRoutePPREnabled);
    const flightRouterState = shouldProvideFlightRouterState ? parseAndValidateFlightRouterState(headers[NEXT_ROUTER_STATE_TREE_HEADER.toLowerCase()]) : undefined;
    // Checks if this is a prefetch of the Route Tree by the Segment Cache
    const isRouteTreePrefetchRequest = headers[NEXT_ROUTER_SEGMENT_PREFETCH_HEADER.toLowerCase()] === '/_tree';
    const csp = headers['content-security-policy'] || headers['content-security-policy-report-only'];
    const nonce = typeof csp === 'string' ? getScriptNonceFromHeader(csp) : undefined;
    return {
        flightRouterState,
        isPrefetchRequest,
        isRouteTreePrefetchRequest,
        isHmrRefresh,
        isRSCRequest,
        isDevWarmupRequest,
        nonce
    };
}
function createNotFoundLoaderTree(loaderTree) {
    // Align the segment with parallel-route-default in next-app-loader
    const components = loaderTree[2];
    return [
        '',
        {
            children: [
                PAGE_SEGMENT_KEY,
                {},
                {
                    page: components['not-found']
                }
            ]
        },
        components
    ];
}
function createDivergedMetadataComponents(Metadata, serveStreamingMetadata) {
    function EmptyMetadata() {
        return null;
    }
    const StreamingMetadata = serveStreamingMetadata ? Metadata : null;
    const StaticMetadata = serveStreamingMetadata ? EmptyMetadata : Metadata;
    return {
        StaticMetadata,
        StreamingMetadata
    };
}
/**
 * Returns a function that parses the dynamic segment and return the associated value.
 */ function makeGetDynamicParamFromSegment(params, pagePath, fallbackRouteParams) {
    return function getDynamicParamFromSegment(// [slug] / [[slug]] / [...slug]
    segment) {
        const segmentParam = getSegmentParam(segment);
        if (!segmentParam) {
            return null;
        }
        const key = segmentParam.param;
        let value = params[key];
        if (fallbackRouteParams && fallbackRouteParams.has(segmentParam.param)) {
            value = fallbackRouteParams.get(segmentParam.param);
        } else if (Array.isArray(value)) {
            value = value.map((i)=>encodeURIComponent(i));
        } else if (typeof value === 'string') {
            value = encodeURIComponent(value);
        }
        if (!value) {
            const isCatchall = segmentParam.type === 'catchall';
            const isOptionalCatchall = segmentParam.type === 'optional-catchall';
            if (isCatchall || isOptionalCatchall) {
                const dynamicParamType = dynamicParamTypes[segmentParam.type];
                // handle the case where an optional catchall does not have a value,
                // e.g. `/dashboard/[[...slug]]` when requesting `/dashboard`
                if (isOptionalCatchall) {
                    return {
                        param: key,
                        value: null,
                        type: dynamicParamType,
                        treeSegment: [
                            key,
                            '',
                            dynamicParamType
                        ]
                    };
                }
                // handle the case where a catchall or optional catchall does not have a value,
                // e.g. `/foo/bar/hello` and `@slot/[...catchall]` or `@slot/[[...catchall]]` is matched
                value = pagePath.split('/')// remove the first empty string
                .slice(1)// replace any dynamic params with the actual values
                .flatMap((pathSegment)=>{
                    const param = parseParameter(pathSegment);
                    // if the segment matches a param, return the param value
                    // otherwise, it's a static segment, so just return that
                    return params[param.key] ?? param.key;
                });
                return {
                    param: key,
                    value,
                    type: dynamicParamType,
                    // This value always has to be a string.
                    treeSegment: [
                        key,
                        value.join('/'),
                        dynamicParamType
                    ]
                };
            }
        }
        const type = getShortDynamicParamType(segmentParam.type);
        return {
            param: key,
            // The value that is passed to user code.
            value: value,
            // The value that is rendered in the router tree.
            treeSegment: [
                key,
                Array.isArray(value) ? value.join('/') : value,
                type
            ],
            type: type
        };
    };
}
function NonIndex({ ctx }) {
    const is404Page = ctx.pagePath === '/404';
    const isInvalidStatusCode = typeof ctx.res.statusCode === 'number' && ctx.res.statusCode > 400;
    // Only render noindex for page request, skip for server actions
    if (!ctx.isAction && (is404Page || isInvalidStatusCode)) {
        return /*#__PURE__*/ _jsx("meta", {
            name: "robots",
            content: "noindex"
        });
    }
    return null;
}
/**
 * This is used by server actions & client-side navigations to generate RSC data from a client-side request.
 * This function is only called on "dynamic" requests (ie, there wasn't already a static response).
 * It uses request headers (namely `Next-Router-State-Tree`) to determine where to start rendering.
 */ async function generateDynamicRSCPayload(ctx, options) {
    // Flight data that is going to be passed to the browser.
    // Currently a single item array but in the future multiple patches might be combined in a single request.
    // We initialize `flightData` to an empty string because the client router knows how to tolerate
    // it (treating it as an MPA navigation). The only time this function wouldn't generate flight data
    // is for server actions, if the server action handler instructs this function to skip it. When the server
    // action reducer sees a falsy value, it'll simply resolve the action with no data.
    let flightData = '';
    const { componentMod: { tree: loaderTree, createServerSearchParamsForMetadata, createServerParamsForMetadata, createMetadataComponents, MetadataBoundary, ViewportBoundary }, getDynamicParamFromSegment, appUsingSizeAdjustment, query, requestId, flightRouterState, workStore, url } = ctx;
    const serveStreamingMetadata = !!ctx.renderOpts.serveStreamingMetadata;
    if (!(options == null ? void 0 : options.skipFlight)) {
        const preloadCallbacks = [];
        const searchParams = createServerSearchParamsForMetadata(query, workStore);
        const { ViewportTree, MetadataTree, getViewportReady, getMetadataReady, StreamingMetadataOutlet } = createMetadataComponents({
            tree: loaderTree,
            searchParams,
            metadataContext: createTrackedMetadataContext(url.pathname, ctx.renderOpts, workStore),
            getDynamicParamFromSegment,
            appUsingSizeAdjustment,
            createServerParamsForMetadata,
            workStore,
            MetadataBoundary,
            ViewportBoundary,
            serveStreamingMetadata
        });
        const { StreamingMetadata, StaticMetadata } = createDivergedMetadataComponents(()=>{
            return(// Adding requestId as react key to make metadata remount for each render
            /*#__PURE__*/ _jsx(MetadataTree, {}, requestId));
        }, serveStreamingMetadata);
        flightData = (await walkTreeWithFlightRouterState({
            ctx,
            loaderTreeToFilter: loaderTree,
            parentParams: {},
            flightRouterState,
            // For flight, render metadata inside leaf page
            rscHead: /*#__PURE__*/ _jsxs(React.Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(NonIndex, {
                        ctx: ctx
                    }),
                    /*#__PURE__*/ _jsx(ViewportTree, {}, requestId),
                    StreamingMetadata ? /*#__PURE__*/ _jsx(StreamingMetadata, {}) : null,
                    /*#__PURE__*/ _jsx(StaticMetadata, {})
                ]
            }, flightDataPathHeadKey),
            injectedCSS: new Set(),
            injectedJS: new Set(),
            injectedFontPreloadTags: new Set(),
            rootLayoutIncluded: false,
            getViewportReady,
            getMetadataReady,
            preloadCallbacks,
            StreamingMetadataOutlet
        })).map((path)=>path.slice(1)) // remove the '' (root) segment
        ;
    }
    // If we have an action result, then this is a server action response.
    // We can rely on this because `ActionResult` will always be a promise, even if
    // the result is falsey.
    if (options == null ? void 0 : options.actionResult) {
        return {
            a: options.actionResult,
            f: flightData,
            b: ctx.sharedContext.buildId
        };
    }
    // Otherwise, it's a regular RSC response.
    return {
        b: ctx.sharedContext.buildId,
        f: flightData,
        S: workStore.isStaticGeneration
    };
}
function createErrorContext(ctx, renderSource) {
    return {
        routerKind: 'App Router',
        routePath: ctx.pagePath,
        routeType: ctx.isAction ? 'action' : 'render',
        renderSource,
        revalidateReason: getRevalidateReason(ctx.workStore)
    };
}
/**
 * Produces a RenderResult containing the Flight data for the given request. See
 * `generateDynamicRSCPayload` for information on the contents of the render result.
 */ async function generateDynamicFlightRenderResult(req, ctx, requestStore, options) {
    const renderOpts = ctx.renderOpts;
    function onFlightDataRenderError(err) {
        return renderOpts.onInstrumentationRequestError == null ? void 0 : renderOpts.onInstrumentationRequestError.call(renderOpts, err, req, createErrorContext(ctx, 'react-server-components-payload'));
    }
    const onError = createFlightReactServerErrorHandler(!!renderOpts.dev, onFlightDataRenderError);
    const RSCPayload = await workUnitAsyncStorage.run(requestStore, generateDynamicRSCPayload, ctx, options);
    if (// We only want this behavior when running `next dev`
    renderOpts.dev && // We only want this behavior when we have React's dev builds available
    process.env.NODE_ENV === 'development' && // We only have a Prerender environment for projects opted into dynamicIO
    renderOpts.experimental.dynamicIO) {
        const [resolveValidation, validationOutlet] = createValidationOutlet();
        RSCPayload._validation = validationOutlet;
        spawnDynamicValidationInDev(resolveValidation, ctx.componentMod.tree, ctx, false, ctx.clientReferenceManifest, ctx.workStore.route, requestStore);
    }
    // For app dir, use the bundled version of Flight server renderer (renderToReadableStream)
    // which contains the subset React.
    const flightReadableStream = workUnitAsyncStorage.run(requestStore, ctx.componentMod.renderToReadableStream, RSCPayload, ctx.clientReferenceManifest.clientModules, {
        onError,
        temporaryReferences: options == null ? void 0 : options.temporaryReferences
    });
    return new FlightRenderResult(flightReadableStream, {
        fetchMetrics: ctx.workStore.fetchMetrics
    });
}
/**
 * Performs a "warmup" render of the RSC payload for a given route. This function is called by the server
 * prior to an actual render request in Dev mode only. It's purpose is to fill caches so the actual render
 * can accurately log activity in the right render context (Prerender vs Render).
 *
 * At the moment this implementation is mostly a fork of generateDynamicFlightRenderResult
 */ async function warmupDevRender(req, ctx) {
    const renderOpts = ctx.renderOpts;
    if (!renderOpts.dev) {
        throw Object.defineProperty(new InvariantError('generateDynamicFlightRenderResult should never be called in `next start` mode.'), "__NEXT_ERROR_CODE", {
            value: "E523",
            enumerable: false,
            configurable: true
        });
    }
    const rootParams = getRootParams(ctx.componentMod.tree, ctx.getDynamicParamFromSegment);
    function onFlightDataRenderError(err) {
        return renderOpts.onInstrumentationRequestError == null ? void 0 : renderOpts.onInstrumentationRequestError.call(renderOpts, err, req, createErrorContext(ctx, 'react-server-components-payload'));
    }
    const onError = createFlightReactServerErrorHandler(true, onFlightDataRenderError);
    // We're doing a dev warmup, so we should create a new resume data cache so
    // we can fill it.
    const prerenderResumeDataCache = createPrerenderResumeDataCache();
    const renderController = new AbortController();
    const prerenderController = new AbortController();
    const cacheSignal = new CacheSignal();
    const prerenderStore = {
        type: 'prerender',
        phase: 'render',
        rootParams,
        implicitTags: [],
        renderSignal: renderController.signal,
        controller: prerenderController,
        cacheSignal,
        dynamicTracking: null,
        revalidate: INFINITE_CACHE,
        expire: INFINITE_CACHE,
        stale: INFINITE_CACHE,
        tags: [],
        prerenderResumeDataCache
    };
    const rscPayload = await workUnitAsyncStorage.run(prerenderStore, generateDynamicRSCPayload, ctx);
    // For app dir, use the bundled version of Flight server renderer (renderToReadableStream)
    // which contains the subset React.
    workUnitAsyncStorage.run(prerenderStore, ctx.componentMod.renderToReadableStream, rscPayload, ctx.clientReferenceManifest.clientModules, {
        onError,
        signal: renderController.signal
    });
    // Wait for all caches to be finished filling
    await cacheSignal.cacheReady();
    // We unset the cache so any late over-run renders aren't able to write into this cache
    prerenderStore.prerenderResumeDataCache = null;
    // Abort the render
    renderController.abort();
    // We don't really want to return a result here but the stack of functions
    // that calls into renderToHTML... expects a result. We should refactor this to
    // lift the warmup pathway outside of renderToHTML... but for now this suffices
    return new FlightRenderResult('', {
        fetchMetrics: ctx.workStore.fetchMetrics,
        devRenderResumeDataCache: createRenderResumeDataCache(prerenderResumeDataCache)
    });
}
/**
 * Crawlers will inadvertently think the canonicalUrl in the RSC payload should be crawled
 * when our intention is to just seed the router state with the current URL.
 * This function splits up the pathname so that we can later join it on
 * when we're ready to consume the path.
 */ function prepareInitialCanonicalUrl(url) {
    return (url.pathname + url.search).split('/');
}
// This is the data necessary to render <AppRouter /> when no SSR errors are encountered
async function getRSCPayload(tree, ctx, is404) {
    const injectedCSS = new Set();
    const injectedJS = new Set();
    const injectedFontPreloadTags = new Set();
    let missingSlots;
    // We only track missing parallel slots in development
    if (process.env.NODE_ENV === 'development') {
        missingSlots = new Set();
    }
    const { getDynamicParamFromSegment, query, appUsingSizeAdjustment, componentMod: { GlobalError, createServerSearchParamsForMetadata, createServerParamsForMetadata, createMetadataComponents, MetadataBoundary, ViewportBoundary }, url, workStore } = ctx;
    const initialTree = createFlightRouterStateFromLoaderTree(tree, getDynamicParamFromSegment, query);
    const serveStreamingMetadata = !!ctx.renderOpts.serveStreamingMetadata;
    const searchParams = createServerSearchParamsForMetadata(query, workStore);
    const { ViewportTree, MetadataTree, getViewportReady, getMetadataReady, StreamingMetadataOutlet } = createMetadataComponents({
        tree,
        errorType: is404 ? 'not-found' : undefined,
        searchParams,
        metadataContext: createTrackedMetadataContext(url.pathname, ctx.renderOpts, workStore),
        getDynamicParamFromSegment,
        appUsingSizeAdjustment,
        createServerParamsForMetadata,
        workStore,
        MetadataBoundary,
        ViewportBoundary,
        serveStreamingMetadata
    });
    const preloadCallbacks = [];
    const { StreamingMetadata, StaticMetadata } = createDivergedMetadataComponents(()=>{
        return(// Not add requestId as react key to ensure segment prefetch could result consistently if nothing changed
        /*#__PURE__*/ _jsx(MetadataTree, {}));
    }, serveStreamingMetadata);
    const seedData = await createComponentTree({
        ctx,
        loaderTree: tree,
        parentParams: {},
        injectedCSS,
        injectedJS,
        injectedFontPreloadTags,
        rootLayoutIncluded: false,
        getViewportReady,
        getMetadataReady,
        missingSlots,
        preloadCallbacks,
        authInterrupts: ctx.renderOpts.experimental.authInterrupts,
        StreamingMetadata,
        StreamingMetadataOutlet
    });
    // When the `vary` response header is present with `Next-URL`, that means there's a chance
    // it could respond differently if there's an interception route. We provide this information
    // to `AppRouter` so that it can properly seed the prefetch cache with a prefix, if needed.
    const varyHeader = ctx.res.getHeader('vary');
    const couldBeIntercepted = typeof varyHeader === 'string' && varyHeader.includes(NEXT_URL);
    const initialHead = /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            /*#__PURE__*/ _jsx(NonIndex, {
                ctx: ctx
            }),
            /*#__PURE__*/ _jsx(ViewportTree, {}, ctx.requestId),
            /*#__PURE__*/ _jsx(StaticMetadata, {})
        ]
    }, flightDataPathHeadKey);
    const globalErrorStyles = await getGlobalErrorStyles(tree, ctx);
    // Assume the head we're rendering contains only partial data if PPR is
    // enabled and this is a statically generated response. This is used by the
    // client Segment Cache after a prefetch to determine if it can skip the
    // second request to fill in the dynamic data.
    //
    // See similar comment in create-component-tree.tsx for more context.
    const isPossiblyPartialHead = workStore.isStaticGeneration && ctx.renderOpts.experimental.isRoutePPREnabled === true;
    return {
        // See the comment above the `Preloads` component (below) for why this is part of the payload
        P: /*#__PURE__*/ _jsx(Preloads, {
            preloadCallbacks: preloadCallbacks
        }),
        b: ctx.sharedContext.buildId,
        p: ctx.assetPrefix,
        c: prepareInitialCanonicalUrl(url),
        i: !!couldBeIntercepted,
        f: [
            [
                initialTree,
                seedData,
                initialHead,
                isPossiblyPartialHead
            ]
        ],
        m: missingSlots,
        G: [
            GlobalError,
            globalErrorStyles
        ],
        s: typeof ctx.renderOpts.postponed === 'string',
        S: workStore.isStaticGeneration
    };
}
/**
 * Preload calls (such as `ReactDOM.preloadStyle` and `ReactDOM.preloadFont`) need to be called during rendering
 * in order to create the appropriate preload tags in the DOM, otherwise they're a no-op. Since we invoke
 * renderToReadableStream with a function that returns component props rather than a component itself, we use
 * this component to "render  " the preload calls.
 */ function Preloads({ preloadCallbacks }) {
    preloadCallbacks.forEach((preloadFn)=>preloadFn());
    return null;
}
// This is the data necessary to render <AppRouter /> when an error state is triggered
async function getErrorRSCPayload(tree, ctx, ssrError, errorType) {
    const { getDynamicParamFromSegment, query, appUsingSizeAdjustment, componentMod: { GlobalError, createServerSearchParamsForMetadata, createServerParamsForMetadata, createMetadataComponents, MetadataBoundary, ViewportBoundary }, url, requestId, workStore } = ctx;
    const serveStreamingMetadata = !!ctx.renderOpts.serveStreamingMetadata;
    const searchParams = createServerSearchParamsForMetadata(query, workStore);
    const { MetadataTree, ViewportTree } = createMetadataComponents({
        tree,
        searchParams,
        // We create an untracked metadata context here because we can't postpone
        // again during the error render.
        metadataContext: createMetadataContext(url.pathname, ctx.renderOpts),
        errorType,
        getDynamicParamFromSegment,
        appUsingSizeAdjustment,
        createServerParamsForMetadata,
        workStore,
        MetadataBoundary,
        ViewportBoundary,
        serveStreamingMetadata: serveStreamingMetadata
    });
    const { StreamingMetadata, StaticMetadata } = createDivergedMetadataComponents(()=>/*#__PURE__*/ _jsx(React.Fragment, {
            children: /*#__PURE__*/ _jsx(MetadataTree, {}, requestId)
        }, flightDataPathHeadKey), serveStreamingMetadata);
    const initialHead = /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [
            /*#__PURE__*/ _jsx(NonIndex, {
                ctx: ctx
            }),
            /*#__PURE__*/ _jsx(ViewportTree, {}, requestId),
            process.env.NODE_ENV === 'development' && /*#__PURE__*/ _jsx("meta", {
                name: "next-error",
                content: "not-found"
            }),
            /*#__PURE__*/ _jsx(StaticMetadata, {})
        ]
    }, flightDataPathHeadKey);
    const initialTree = createFlightRouterStateFromLoaderTree(tree, getDynamicParamFromSegment, query);
    let err = undefined;
    if (ssrError) {
        err = isError(ssrError) ? ssrError : Object.defineProperty(new Error(ssrError + ''), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    // For metadata notFound error there's no global not found boundary on top
    // so we create a not found page with AppRouter
    const seedData = [
        initialTree[0],
        /*#__PURE__*/ _jsxs("html", {
            id: "__next_error__",
            children: [
                /*#__PURE__*/ _jsx("head", {
                    children: StreamingMetadata ? /*#__PURE__*/ _jsx(StreamingMetadata, {}) : null
                }),
                /*#__PURE__*/ _jsx("body", {
                    children: process.env.NODE_ENV !== 'production' && err ? /*#__PURE__*/ _jsx("template", {
                        "data-next-error-message": err.message,
                        "data-next-error-digest": 'digest' in err ? err.digest : '',
                        "data-next-error-stack": err.stack
                    }) : null
                })
            ]
        }),
        {},
        null,
        false
    ];
    const globalErrorStyles = await getGlobalErrorStyles(tree, ctx);
    const isPossiblyPartialHead = workStore.isStaticGeneration && ctx.renderOpts.experimental.isRoutePPREnabled === true;
    return {
        b: ctx.sharedContext.buildId,
        p: ctx.assetPrefix,
        c: prepareInitialCanonicalUrl(url),
        m: undefined,
        i: false,
        f: [
            [
                initialTree,
                seedData,
                initialHead,
                isPossiblyPartialHead
            ]
        ],
        G: [
            GlobalError,
            globalErrorStyles
        ],
        s: typeof ctx.renderOpts.postponed === 'string',
        S: workStore.isStaticGeneration
    };
}
// This component must run in an SSR context. It will render the RSC root component
function App({ reactServerStream, preinitScripts, clientReferenceManifest, nonce, ServerInsertedHTMLProvider, ServerInsertedMetadataProvider }) {
    preinitScripts();
    const response = React.use(useFlightStream(reactServerStream, clientReferenceManifest, nonce));
    const initialState = createInitialRouterState({
        initialFlightData: response.f,
        initialCanonicalUrlParts: response.c,
        initialParallelRoutes: new Map(),
        // location is not initialized in the SSR render
        // it's set to window.location during hydration
        location: null,
        couldBeIntercepted: response.i,
        postponed: response.s,
        prerendered: response.S
    });
    const actionQueue = createMutableActionQueue(initialState);
    const { HeadManagerContext } = require('../../shared/lib/head-manager-context.shared-runtime');
    return /*#__PURE__*/ _jsx(HeadManagerContext.Provider, {
        value: {
            appDir: true,
            nonce
        },
        children: /*#__PURE__*/ _jsx(ServerInsertedMetadataProvider, {
            children: /*#__PURE__*/ _jsx(ServerInsertedHTMLProvider, {
                children: /*#__PURE__*/ _jsx(AppRouter, {
                    actionQueue: actionQueue,
                    globalErrorComponentAndStyles: response.G,
                    assetPrefix: response.p
                })
            })
        })
    });
}
// @TODO our error stream should be probably just use the same root component. But it was previously
// different I don't want to figure out if that is meaningful at this time so just keeping the behavior
// consistent for now.
function AppWithoutContext({ reactServerStream, preinitScripts, clientReferenceManifest, nonce }) {
    preinitScripts();
    const response = React.use(useFlightStream(reactServerStream, clientReferenceManifest, nonce));
    const initialState = createInitialRouterState({
        initialFlightData: response.f,
        initialCanonicalUrlParts: response.c,
        initialParallelRoutes: new Map(),
        // location is not initialized in the SSR render
        // it's set to window.location during hydration
        location: null,
        couldBeIntercepted: response.i,
        postponed: response.s,
        prerendered: response.S
    });
    const actionQueue = createMutableActionQueue(initialState);
    return /*#__PURE__*/ _jsx(AppRouter, {
        actionQueue: actionQueue,
        globalErrorComponentAndStyles: response.G,
        assetPrefix: response.p
    });
}
async function renderToHTMLOrFlightImpl(req, res, url, pagePath, query, renderOpts, workStore, parsedRequestHeaders, requestEndedState, postponedState, implicitTags, serverComponentsHmrCache, sharedContext) {
    const isNotFoundPath = pagePath === '/404';
    if (isNotFoundPath) {
        res.statusCode = 404;
    }
    // A unique request timestamp used by development to ensure that it's
    // consistent and won't change during this request. This is important to
    // avoid that resources can be deduped by React Float if the same resource is
    // rendered or preloaded multiple times: `<link href="a.css?v={Date.now()}"/>`.
    const requestTimestamp = Date.now();
    const { serverActionsManifest, ComponentMod, nextFontManifest, serverActions, assetPrefix = '', enableTainting } = renderOpts;
    // We need to expose the bundled `require` API globally for
    // react-server-dom-webpack. This is a hack until we find a better way.
    if (ComponentMod.__next_app__) {
        const instrumented = wrapClientComponentLoader(ComponentMod);
        // @ts-ignore
        globalThis.__next_require__ = instrumented.require;
        // When we are prerendering if there is a cacheSignal for tracking
        // cache reads we wrap the loadChunk in this tracking. This allows us
        // to treat chunk loading with similar semantics as cache reads to avoid
        // async loading chunks from causing a prerender to abort too early.
        const __next_chunk_load__ = (...args)=>{
            const loadingChunk = instrumented.loadChunk(...args);
            trackChunkLoading(loadingChunk);
            return loadingChunk;
        };
        // @ts-expect-error
        globalThis.__next_chunk_load__ = __next_chunk_load__;
    }
    if (process.env.NODE_ENV === 'development') {
        // reset isr status at start of request
        const { pathname } = new URL(req.url || '/', 'http://n');
        renderOpts.setIsrStatus == null ? void 0 : renderOpts.setIsrStatus.call(renderOpts, pathname, null);
    }
    if (// The type check here ensures that `req` is correctly typed, and the
    // environment variable check provides dead code elimination.
    process.env.NEXT_RUNTIME !== 'edge' && isNodeNextRequest(req)) {
        req.originalRequest.on('end', ()=>{
            requestEndedState.ended = true;
            if ('performance' in globalThis) {
                const metrics = getClientComponentLoaderMetrics({
                    reset: true
                });
                if (metrics) {
                    getTracer().startSpan(NextNodeServerSpan.clientComponentLoading, {
                        startTime: metrics.clientComponentLoadStart,
                        attributes: {
                            'next.clientComponentLoadCount': metrics.clientComponentLoadCount,
                            'next.span_type': NextNodeServerSpan.clientComponentLoading
                        }
                    }).end(metrics.clientComponentLoadStart + metrics.clientComponentLoadTimes);
                }
            }
        });
    }
    const metadata = {};
    const appUsingSizeAdjustment = !!(nextFontManifest == null ? void 0 : nextFontManifest.appUsingSizeAdjust);
    // TODO: fix this typescript
    const clientReferenceManifest = renderOpts.clientReferenceManifest;
    const serverModuleMap = createServerModuleMap({
        serverActionsManifest
    });
    setReferenceManifestsSingleton({
        page: workStore.page,
        clientReferenceManifest,
        serverActionsManifest,
        serverModuleMap
    });
    ComponentMod.patchFetch();
    // Pull out the hooks/references from the component.
    const { tree: loaderTree, taintObjectReference } = ComponentMod;
    if (enableTainting) {
        taintObjectReference('Do not pass process.env to client components since it will leak sensitive data', process.env);
    }
    workStore.fetchMetrics = [];
    metadata.fetchMetrics = workStore.fetchMetrics;
    // don't modify original query object
    query = {
        ...query
    };
    stripInternalQueries(query);
    const { flightRouterState, isPrefetchRequest, isRSCRequest, isDevWarmupRequest, isHmrRefresh, nonce } = parsedRequestHeaders;
    /**
   * The metadata items array created in next-app-loader with all relevant information
   * that we need to resolve the final metadata.
   */ let requestId;
    if (process.env.NEXT_RUNTIME === 'edge') {
        requestId = crypto.randomUUID();
    } else {
        requestId = require('next/dist/compiled/nanoid').nanoid();
    }
    /**
   * Dynamic parameters. E.g. when you visit `/dashboard/vercel` which is rendered by `/dashboard/[slug]` the value will be {"slug": "vercel"}.
   */ const params = renderOpts.params ?? {};
    const { isStaticGeneration, fallbackRouteParams } = workStore;
    const getDynamicParamFromSegment = makeGetDynamicParamFromSegment(params, pagePath, fallbackRouteParams);
    const isActionRequest = getServerActionRequestMetadata(req).isServerAction;
    const ctx = {
        componentMod: ComponentMod,
        url,
        renderOpts,
        workStore,
        parsedRequestHeaders,
        getDynamicParamFromSegment,
        query,
        isPrefetch: isPrefetchRequest,
        isAction: isActionRequest,
        requestTimestamp,
        appUsingSizeAdjustment,
        flightRouterState,
        requestId,
        pagePath,
        clientReferenceManifest,
        assetPrefix,
        isNotFoundPath,
        nonce,
        res,
        sharedContext
    };
    getTracer().setRootSpanAttribute('next.route', pagePath);
    if (isStaticGeneration) {
        var _metadata_cacheControl;
        // We're either building or revalidating. In either case we need to
        // prerender our page rather than render it.
        const prerenderToStreamWithTracing = getTracer().wrap(AppRenderSpan.getBodyResult, {
            spanName: `prerender route (app) ${pagePath}`,
            attributes: {
                'next.route': pagePath
            }
        }, prerenderToStream);
        const response = await prerenderToStreamWithTracing(req, res, ctx, metadata, workStore, loaderTree, implicitTags);
        // If we're debugging partial prerendering, print all the dynamic API accesses
        // that occurred during the render.
        // @TODO move into renderToStream function
        if (response.dynamicAccess && accessedDynamicData(response.dynamicAccess) && renderOpts.isDebugDynamicAccesses) {
            warn('The following dynamic usage was detected:');
            for (const access of formatDynamicAPIAccesses(response.dynamicAccess)){
                warn(access);
            }
        }
        // If we encountered any unexpected errors during build we fail the
        // prerendering phase and the build.
        if (response.digestErrorsMap.size) {
            const buildFailingError = response.digestErrorsMap.values().next().value;
            if (buildFailingError) throw buildFailingError;
        }
        // Pick first userland SSR error, which is also not a RSC error.
        if (response.ssrErrors.length) {
            const buildFailingError = response.ssrErrors.find((err)=>isUserLandError(err));
            if (buildFailingError) throw buildFailingError;
        }
        const options = {
            metadata
        };
        // If we have pending revalidates, wait until they are all resolved.
        if (workStore.pendingRevalidates || workStore.pendingRevalidateWrites || workStore.revalidatedTags) {
            var _workStore_incrementalCache;
            const pendingPromise = Promise.all([
                (_workStore_incrementalCache = workStore.incrementalCache) == null ? void 0 : _workStore_incrementalCache.revalidateTag(workStore.revalidatedTags || []),
                ...Object.values(workStore.pendingRevalidates || {}),
                ...workStore.pendingRevalidateWrites || []
            ]).finally(()=>{
                if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
                    console.log('pending revalidates promise finished for:', url);
                }
            });
            if (renderOpts.waitUntil) {
                renderOpts.waitUntil(pendingPromise);
            } else {
                options.waitUntil = pendingPromise;
            }
        }
        if (response.collectedTags) {
            metadata.fetchTags = response.collectedTags.join(',');
        }
        // Let the client router know how long to keep the cached entry around.
        const staleHeader = String(response.collectedStale);
        res.setHeader(NEXT_ROUTER_STALE_TIME_HEADER, staleHeader);
        metadata.headers ??= {};
        metadata.headers[NEXT_ROUTER_STALE_TIME_HEADER] = staleHeader;
        // If force static is specifically set to false, we should not revalidate
        // the page.
        if (workStore.forceStatic === false || response.collectedRevalidate === 0) {
            metadata.cacheControl = {
                revalidate: 0,
                expire: undefined
            };
        } else {
            // Copy the cache control value onto the render result metadata.
            metadata.cacheControl = {
                revalidate: response.collectedRevalidate >= INFINITE_CACHE ? false : response.collectedRevalidate,
                expire: response.collectedExpire >= INFINITE_CACHE ? undefined : response.collectedExpire
            };
        }
        // provide bailout info for debugging
        if (((_metadata_cacheControl = metadata.cacheControl) == null ? void 0 : _metadata_cacheControl.revalidate) === 0) {
            metadata.staticBailoutInfo = {
                description: workStore.dynamicUsageDescription,
                stack: workStore.dynamicUsageStack
            };
        }
        return new RenderResult(await streamToString(response.stream), options);
    } else {
        // We're rendering dynamically
        const renderResumeDataCache = renderOpts.devRenderResumeDataCache ?? (postponedState == null ? void 0 : postponedState.renderResumeDataCache);
        const rootParams = getRootParams(loaderTree, ctx.getDynamicParamFromSegment);
        const requestStore = createRequestStoreForRender(req, res, url, rootParams, implicitTags, renderOpts.onUpdateCookies, renderOpts.previewProps, isHmrRefresh, serverComponentsHmrCache, renderResumeDataCache);
        if (process.env.NODE_ENV === 'development' && renderOpts.setIsrStatus && // The type check here ensures that `req` is correctly typed, and the
        // environment variable check provides dead code elimination.
        process.env.NEXT_RUNTIME !== 'edge' && isNodeNextRequest(req) && !isDevWarmupRequest) {
            const setIsrStatus = renderOpts.setIsrStatus;
            req.originalRequest.on('end', ()=>{
                if (!requestStore.usedDynamic && !workStore.forceDynamic) {
                    // only node can be ISR so we only need to update the status here
                    const { pathname } = new URL(req.url || '/', 'http://n');
                    setIsrStatus(pathname, true);
                }
            });
        }
        if (isDevWarmupRequest) {
            return warmupDevRender(req, ctx);
        } else if (isRSCRequest) {
            return generateDynamicFlightRenderResult(req, ctx, requestStore);
        }
        const renderToStreamWithTracing = getTracer().wrap(AppRenderSpan.getBodyResult, {
            spanName: `render route (app) ${pagePath}`,
            attributes: {
                'next.route': pagePath
            }
        }, renderToStream);
        let formState = null;
        if (isActionRequest) {
            // For action requests, we handle them differently with a special render result.
            const actionRequestResult = await handleAction({
                req,
                res,
                ComponentMod,
                serverModuleMap,
                generateFlight: generateDynamicFlightRenderResult,
                workStore,
                requestStore,
                serverActions,
                ctx
            });
            if (actionRequestResult) {
                if (actionRequestResult.type === 'not-found') {
                    const notFoundLoaderTree = createNotFoundLoaderTree(loaderTree);
                    res.statusCode = 404;
                    const stream = await renderToStreamWithTracing(requestStore, req, res, ctx, workStore, notFoundLoaderTree, formState, postponedState);
                    return new RenderResult(stream, {
                        metadata
                    });
                } else if (actionRequestResult.type === 'done') {
                    if (actionRequestResult.result) {
                        actionRequestResult.result.assignMetadata(metadata);
                        return actionRequestResult.result;
                    } else if (actionRequestResult.formState) {
                        formState = actionRequestResult.formState;
                    }
                }
            }
        }
        const options = {
            metadata
        };
        const stream = await renderToStreamWithTracing(requestStore, req, res, ctx, workStore, loaderTree, formState, postponedState);
        // If we have pending revalidates, wait until they are all resolved.
        if (workStore.pendingRevalidates || workStore.pendingRevalidateWrites || workStore.revalidatedTags) {
            var _workStore_incrementalCache1;
            const pendingPromise = Promise.all([
                (_workStore_incrementalCache1 = workStore.incrementalCache) == null ? void 0 : _workStore_incrementalCache1.revalidateTag(workStore.revalidatedTags || []),
                ...Object.values(workStore.pendingRevalidates || {}),
                ...workStore.pendingRevalidateWrites || []
            ]).finally(()=>{
                if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
                    console.log('pending revalidates promise finished for:', url);
                }
            });
            if (renderOpts.waitUntil) {
                renderOpts.waitUntil(pendingPromise);
            } else {
                options.waitUntil = pendingPromise;
            }
        }
        // Create the new render result for the response.
        return new RenderResult(stream, options);
    }
}
export const renderToHTMLOrFlight = (req, res, pagePath, query, fallbackRouteParams, renderOpts, serverComponentsHmrCache, isDevWarmup, sharedContext)=>{
    if (!req.url) {
        throw Object.defineProperty(new Error('Invalid URL'), "__NEXT_ERROR_CODE", {
            value: "E182",
            enumerable: false,
            configurable: true
        });
    }
    const url = parseRelativeUrl(req.url, undefined, false);
    // We read these values from the request object as, in certain cases,
    // base-server will strip them to opt into different rendering behavior.
    const parsedRequestHeaders = parseRequestHeaders(req.headers, {
        isDevWarmup,
        isRoutePPREnabled: renderOpts.experimental.isRoutePPREnabled === true
    });
    const { isPrefetchRequest } = parsedRequestHeaders;
    const requestEndedState = {
        ended: false
    };
    let postponedState = null;
    // If provided, the postpone state should be parsed so it can be provided to
    // React.
    if (typeof renderOpts.postponed === 'string') {
        if (fallbackRouteParams) {
            throw Object.defineProperty(new InvariantError('postponed state should not be provided when fallback params are provided'), "__NEXT_ERROR_CODE", {
                value: "E592",
                enumerable: false,
                configurable: true
            });
        }
        postponedState = parsePostponedState(renderOpts.postponed, renderOpts.params);
    }
    if ((postponedState == null ? void 0 : postponedState.renderResumeDataCache) && renderOpts.devRenderResumeDataCache) {
        throw Object.defineProperty(new InvariantError('postponed state and dev warmup immutable resume data cache should not be provided together'), "__NEXT_ERROR_CODE", {
            value: "E589",
            enumerable: false,
            configurable: true
        });
    }
    const implicitTags = getImplicitTags(renderOpts.routeModule.definition.page, url, fallbackRouteParams);
    const workStore = createWorkStore({
        page: renderOpts.routeModule.definition.page,
        fallbackRouteParams,
        renderOpts,
        requestEndedState,
        // @TODO move to workUnitStore of type Request
        isPrefetchRequest,
        buildId: sharedContext.buildId
    });
    return workAsyncStorage.run(workStore, // The function to run
    renderToHTMLOrFlightImpl, // all of it's args
    req, res, url, pagePath, query, renderOpts, workStore, parsedRequestHeaders, requestEndedState, postponedState, implicitTags, serverComponentsHmrCache, sharedContext);
};
async function renderToStream(requestStore, req, res, ctx, workStore, tree, formState, postponedState) {
    const renderOpts = ctx.renderOpts;
    const ComponentMod = renderOpts.ComponentMod;
    // TODO: fix this typescript
    const clientReferenceManifest = renderOpts.clientReferenceManifest;
    const { ServerInsertedHTMLProvider, renderServerInsertedHTML } = createServerInsertedHTML();
    const { ServerInsertedMetadataProvider, getServerInsertedMetadata } = createServerInsertedMetadata(ctx.nonce);
    const tracingMetadata = getTracedMetadata(getTracer().getTracePropagationData(), renderOpts.experimental.clientTraceMetadata);
    const polyfills = renderOpts.buildManifest.polyfillFiles.filter((polyfill)=>polyfill.endsWith('.js') && !polyfill.endsWith('.module.js')).map((polyfill)=>{
        var _renderOpts_subresourceIntegrityManifest;
        return {
            src: `${ctx.assetPrefix}/_next/${polyfill}${getAssetQueryString(ctx, false)}`,
            integrity: (_renderOpts_subresourceIntegrityManifest = renderOpts.subresourceIntegrityManifest) == null ? void 0 : _renderOpts_subresourceIntegrityManifest[polyfill],
            crossOrigin: renderOpts.crossOrigin,
            noModule: true,
            nonce: ctx.nonce
        };
    });
    const [preinitScripts, bootstrapScript] = getRequiredScripts(renderOpts.buildManifest, // Why is assetPrefix optional on renderOpts?
    // @TODO make it default empty string on renderOpts and get rid of it from ctx
    ctx.assetPrefix, renderOpts.crossOrigin, renderOpts.subresourceIntegrityManifest, getAssetQueryString(ctx, true), ctx.nonce, renderOpts.page);
    const reactServerErrorsByDigest = new Map();
    const silenceLogger = false;
    function onHTMLRenderRSCError(err) {
        return renderOpts.onInstrumentationRequestError == null ? void 0 : renderOpts.onInstrumentationRequestError.call(renderOpts, err, req, createErrorContext(ctx, 'react-server-components'));
    }
    const serverComponentsErrorHandler = createHTMLReactServerErrorHandler(!!renderOpts.dev, !!renderOpts.nextExport, reactServerErrorsByDigest, silenceLogger, onHTMLRenderRSCError);
    function onHTMLRenderSSRError(err) {
        return renderOpts.onInstrumentationRequestError == null ? void 0 : renderOpts.onInstrumentationRequestError.call(renderOpts, err, req, createErrorContext(ctx, 'server-rendering'));
    }
    const allCapturedErrors = [];
    const htmlRendererErrorHandler = createHTMLErrorHandler(!!renderOpts.dev, !!renderOpts.nextExport, reactServerErrorsByDigest, allCapturedErrors, silenceLogger, onHTMLRenderSSRError);
    let reactServerResult = null;
    const setHeader = res.setHeader.bind(res);
    const appendHeader = res.appendHeader.bind(res);
    try {
        if (// We only want this behavior when running `next dev`
        renderOpts.dev && // We only want this behavior when we have React's dev builds available
        process.env.NODE_ENV === 'development' && // Edge routes never prerender so we don't have a Prerender environment for anything in edge runtime
        process.env.NEXT_RUNTIME !== 'edge' && // We only have a Prerender environment for projects opted into dynamicIO
        renderOpts.experimental.dynamicIO) {
            // This is a dynamic render. We don't do dynamic tracking because we're not prerendering
            const RSCPayload = await workUnitAsyncStorage.run(requestStore, getRSCPayload, tree, ctx, res.statusCode === 404);
            const [resolveValidation, validationOutlet] = createValidationOutlet();
            RSCPayload._validation = validationOutlet;
            const reactServerStream = await workUnitAsyncStorage.run(requestStore, scheduleInSequentialTasks, ()=>{
                requestStore.prerenderPhase = true;
                return ComponentMod.renderToReadableStream(RSCPayload, clientReferenceManifest.clientModules, {
                    onError: serverComponentsErrorHandler,
                    environmentName: ()=>requestStore.prerenderPhase === true ? 'Prerender' : 'Server',
                    filterStackFrame (url, _functionName) {
                        // The default implementation filters out <anonymous> stack frames
                        // but we want to retain them because current Server Components and
                        // built-in Components in parent stacks don't have source location.
                        return !url.startsWith('node:') && !url.includes('node_modules');
                    }
                });
            }, ()=>{
                requestStore.prerenderPhase = false;
            });
            spawnDynamicValidationInDev(resolveValidation, tree, ctx, res.statusCode === 404, clientReferenceManifest, workStore.route, requestStore);
            reactServerResult = new ReactServerResult(reactServerStream);
        } else {
            // This is a dynamic render. We don't do dynamic tracking because we're not prerendering
            const RSCPayload = await workUnitAsyncStorage.run(requestStore, getRSCPayload, tree, ctx, res.statusCode === 404);
            reactServerResult = new ReactServerResult(workUnitAsyncStorage.run(requestStore, ComponentMod.renderToReadableStream, RSCPayload, clientReferenceManifest.clientModules, {
                onError: serverComponentsErrorHandler
            }));
        }
        // React doesn't start rendering synchronously but we want the RSC render to have a chance to start
        // before we begin SSR rendering because we want to capture any available preload headers so we tick
        // one task before continuing
        await waitAtLeastOneReactRenderTask();
        // If provided, the postpone state should be parsed as JSON so it can be
        // provided to React.
        if (typeof renderOpts.postponed === 'string') {
            if ((postponedState == null ? void 0 : postponedState.type) === DynamicState.DATA) {
                // We have a complete HTML Document in the prerender but we need to
                // still include the new server component render because it was not included
                // in the static prelude.
                const inlinedReactServerDataStream = createInlinedDataReadableStream(reactServerResult.tee(), ctx.nonce, formState);
                return chainStreams(inlinedReactServerDataStream, createDocumentClosingStream());
            } else if (postponedState) {
                // We assume we have dynamic HTML requiring a resume render to complete
                const postponed = getPostponedFromState(postponedState);
                const resume = require('react-dom/server.edge').resume;
                const htmlStream = await workUnitAsyncStorage.run(requestStore, resume, /*#__PURE__*/ _jsx(App, {
                    reactServerStream: reactServerResult.tee(),
                    preinitScripts: preinitScripts,
                    clientReferenceManifest: clientReferenceManifest,
                    ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                    ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                    nonce: ctx.nonce
                }), postponed, {
                    onError: htmlRendererErrorHandler,
                    nonce: ctx.nonce
                });
                const getServerInsertedHTML = makeGetServerInsertedHTML({
                    polyfills,
                    renderServerInsertedHTML,
                    serverCapturedErrors: allCapturedErrors,
                    basePath: renderOpts.basePath,
                    tracingMetadata: tracingMetadata
                });
                return await continueDynamicHTMLResume(htmlStream, {
                    inlinedDataStream: createInlinedDataReadableStream(reactServerResult.consume(), ctx.nonce, formState),
                    getServerInsertedHTML,
                    getServerInsertedMetadata
                });
            }
        }
        // This is a regular dynamic render
        const renderToReadableStream = require('react-dom/server.edge').renderToReadableStream;
        const htmlStream = await workUnitAsyncStorage.run(requestStore, renderToReadableStream, /*#__PURE__*/ _jsx(App, {
            reactServerStream: reactServerResult.tee(),
            preinitScripts: preinitScripts,
            clientReferenceManifest: clientReferenceManifest,
            ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
            ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
            nonce: ctx.nonce
        }), {
            onError: htmlRendererErrorHandler,
            nonce: ctx.nonce,
            onHeaders: (headers)=>{
                headers.forEach((value, key)=>{
                    appendHeader(key, value);
                });
            },
            maxHeadersLength: renderOpts.reactMaxHeadersLength,
            bootstrapScripts: [
                bootstrapScript
            ],
            formState
        });
        const getServerInsertedHTML = makeGetServerInsertedHTML({
            polyfills,
            renderServerInsertedHTML,
            serverCapturedErrors: allCapturedErrors,
            basePath: renderOpts.basePath,
            tracingMetadata: tracingMetadata
        });
        /**
     * Rules of Static & Dynamic HTML:
     *
     *    1.) We must generate static HTML unless the caller explicitly opts
     *        in to dynamic HTML support.
     *
     *    2.) If dynamic HTML support is requested, we must honor that request
     *        or throw an error. It is the sole responsibility of the caller to
     *        ensure they aren't e.g. requesting dynamic HTML for an AMP page.
     *
     *   3.) If `shouldWaitOnAllReady` is true, which indicates we need to
     *       resolve all suspenses and generate a full HTML. e.g. when it's a
     *       html limited bot requests, we produce the full HTML content.
     *
     * These rules help ensure that other existing features like request caching,
     * coalescing, and ISR continue working as intended.
     */ const generateStaticHTML = renderOpts.supportsDynamicResponse !== true || !!renderOpts.shouldWaitOnAllReady;
        const validateRootLayout = renderOpts.dev;
        return await continueFizzStream(htmlStream, {
            inlinedDataStream: createInlinedDataReadableStream(reactServerResult.consume(), ctx.nonce, formState),
            isStaticGeneration: generateStaticHTML,
            getServerInsertedHTML,
            getServerInsertedMetadata,
            validateRootLayout
        });
    } catch (err) {
        if (isStaticGenBailoutError(err) || typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string' && err.message.includes('https://nextjs.org/docs/advanced-features/static-html-export')) {
            // Ensure that "next dev" prints the red error overlay
            throw err;
        }
        // If a bailout made it to this point, it means it wasn't wrapped inside
        // a suspense boundary.
        const shouldBailoutToCSR = isBailoutToCSRError(err);
        if (shouldBailoutToCSR) {
            const stack = getStackWithoutErrorMessage(err);
            error(`${err.reason} should be wrapped in a suspense boundary at page "${ctx.pagePath}". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout\n${stack}`);
            throw err;
        }
        let errorType;
        if (isHTTPAccessFallbackError(err)) {
            res.statusCode = getAccessFallbackHTTPStatus(err);
            errorType = getAccessFallbackErrorTypeByStatus(res.statusCode);
        } else if (isRedirectError(err)) {
            errorType = 'redirect';
            res.statusCode = getRedirectStatusCodeFromError(err);
            const redirectUrl = addPathPrefix(getURLFromRedirectError(err), renderOpts.basePath);
            // If there were mutable cookies set, we need to set them on the
            // response.
            const headers = new Headers();
            if (appendMutableCookies(headers, requestStore.mutableCookies)) {
                setHeader('set-cookie', Array.from(headers.values()));
            }
            setHeader('location', redirectUrl);
        } else if (!shouldBailoutToCSR) {
            res.statusCode = 500;
        }
        const [errorPreinitScripts, errorBootstrapScript] = getRequiredScripts(renderOpts.buildManifest, ctx.assetPrefix, renderOpts.crossOrigin, renderOpts.subresourceIntegrityManifest, getAssetQueryString(ctx, false), ctx.nonce, '/_not-found/page');
        const errorRSCPayload = await workUnitAsyncStorage.run(requestStore, getErrorRSCPayload, tree, ctx, reactServerErrorsByDigest.has(err.digest) ? null : err, errorType);
        const errorServerStream = workUnitAsyncStorage.run(requestStore, ComponentMod.renderToReadableStream, errorRSCPayload, clientReferenceManifest.clientModules, {
            onError: serverComponentsErrorHandler
        });
        if (reactServerResult === null) {
            // We errored when we did not have an RSC stream to read from. This is not just a render
            // error, we need to throw early
            throw err;
        }
        try {
            const fizzStream = await workUnitAsyncStorage.run(requestStore, renderToInitialFizzStream, {
                ReactDOMServer: require('react-dom/server.edge'),
                element: /*#__PURE__*/ _jsx(AppWithoutContext, {
                    reactServerStream: errorServerStream,
                    preinitScripts: errorPreinitScripts,
                    clientReferenceManifest: clientReferenceManifest,
                    nonce: ctx.nonce
                }),
                streamOptions: {
                    nonce: ctx.nonce,
                    // Include hydration scripts in the HTML
                    bootstrapScripts: [
                        errorBootstrapScript
                    ],
                    formState
                }
            });
            /**
       * Rules of Static & Dynamic HTML:
       *
       *    1.) We must generate static HTML unless the caller explicitly opts
       *        in to dynamic HTML support.
       *
       *    2.) If dynamic HTML support is requested, we must honor that request
       *        or throw an error. It is the sole responsibility of the caller to
       *        ensure they aren't e.g. requesting dynamic HTML for an AMP page.
       *    3.) If `shouldWaitOnAllReady` is true, which indicates we need to
       *        resolve all suspenses and generate a full HTML. e.g. when it's a
       *        html limited bot requests, we produce the full HTML content.
       *
       * These rules help ensure that other existing features like request caching,
       * coalescing, and ISR continue working as intended.
       */ const generateStaticHTML = renderOpts.supportsDynamicResponse !== true || !!renderOpts.shouldWaitOnAllReady;
            const validateRootLayout = renderOpts.dev;
            return await continueFizzStream(fizzStream, {
                inlinedDataStream: createInlinedDataReadableStream(// This is intentionally using the readable datastream from the
                // main render rather than the flight data from the error page
                // render
                reactServerResult.consume(), ctx.nonce, formState),
                isStaticGeneration: generateStaticHTML,
                getServerInsertedHTML: makeGetServerInsertedHTML({
                    polyfills,
                    renderServerInsertedHTML,
                    serverCapturedErrors: [],
                    basePath: renderOpts.basePath,
                    tracingMetadata: tracingMetadata
                }),
                getServerInsertedMetadata,
                validateRootLayout
            });
        } catch (finalErr) {
            if (process.env.NODE_ENV === 'development' && isHTTPAccessFallbackError(finalErr)) {
                const { bailOnRootNotFound } = require('../../client/components/dev-root-http-access-fallback-boundary');
                bailOnRootNotFound();
            }
            throw finalErr;
        }
    }
}
function createValidationOutlet() {
    let resolveValidation;
    let outlet = new Promise((resolve)=>{
        resolveValidation = resolve;
    });
    return [
        resolveValidation,
        outlet
    ];
}
async function spawnDynamicValidationInDev(resolveValidation, tree, ctx, isNotFound, clientReferenceManifest, route, requestStore) {
    const { componentMod: ComponentMod } = ctx;
    const rootParams = getRootParams(ComponentMod.tree, ctx.getDynamicParamFromSegment);
    // Prerender controller represents the lifetime of the prerender.
    // It will be aborted when a Task is complete or a synchronously aborting
    // API is called. Notably during cache-filling renders this does not actually
    // terminate the render itself which will continue until all caches are filled
    const initialServerPrerenderController = new AbortController();
    // This controller represents the lifetime of the React render call. Notably
    // during the cache-filling render it is different from the prerender controller
    // because we don't want to end the react render until all caches are filled.
    const initialServerRenderController = new AbortController();
    const cacheSignal = new CacheSignal();
    const prerenderResumeDataCache = createPrerenderResumeDataCache();
    const initialServerPrerenderStore = {
        type: 'prerender',
        phase: 'render',
        rootParams,
        implicitTags: [],
        renderSignal: initialServerRenderController.signal,
        controller: initialServerPrerenderController,
        cacheSignal,
        dynamicTracking: null,
        revalidate: INFINITE_CACHE,
        expire: INFINITE_CACHE,
        stale: INFINITE_CACHE,
        tags: [],
        prerenderResumeDataCache
    };
    const initialClientController = new AbortController();
    const initialClientPrerenderStore = {
        type: 'prerender',
        phase: 'render',
        rootParams,
        implicitTags: [],
        renderSignal: initialClientController.signal,
        controller: initialClientController,
        cacheSignal,
        dynamicTracking: null,
        revalidate: INFINITE_CACHE,
        expire: INFINITE_CACHE,
        stale: INFINITE_CACHE,
        tags: [],
        prerenderResumeDataCache
    };
    // We're not going to use the result of this render because the only time it could be used
    // is if it completes in a microtask and that's likely very rare for any non-trivial app
    const firstAttemptRSCPayload = await workUnitAsyncStorage.run(initialServerPrerenderStore, getRSCPayload, tree, ctx, isNotFound);
    let initialServerStream;
    try {
        initialServerStream = workUnitAsyncStorage.run(initialServerPrerenderStore, ComponentMod.renderToReadableStream, firstAttemptRSCPayload, clientReferenceManifest.clientModules, {
            onError: (err)=>{
                const digest = getDigestForWellKnownError(err);
                if (digest) {
                    return digest;
                }
                if (initialServerPrerenderController.signal.aborted || initialServerRenderController.signal.aborted) {
                    // The render aborted before this error was handled which indicates
                    // the error is caused by unfinished components within the render
                    return;
                } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                    printDebugThrownValueForProspectiveRender(err, route);
                }
            },
            signal: initialServerRenderController.signal
        });
    } catch (err) {
        if (initialServerPrerenderController.signal.aborted || initialServerRenderController.signal.aborted) {
        // These are expected errors that might error the prerender. we ignore them.
        } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
            // We don't normally log these errors because we are going to retry anyway but
            // it can be useful for debugging Next.js itself to get visibility here when needed
            printDebugThrownValueForProspectiveRender(err, route);
        }
    }
    const nonce = '1';
    const { ServerInsertedHTMLProvider } = createServerInsertedHTML();
    const { ServerInsertedMetadataProvider } = createServerInsertedMetadata(nonce);
    if (initialServerStream) {
        const [warmupStream, renderStream] = initialServerStream.tee();
        initialServerStream = null;
        // Before we attempt the SSR initial render we need to ensure all client modules
        // are already loaded.
        await warmFlightResponse(warmupStream, clientReferenceManifest);
        const prerender = require('react-dom/static.edge').prerender;
        const pendingInitialClientResult = workUnitAsyncStorage.run(initialClientPrerenderStore, prerender, /*#__PURE__*/ _jsx(App, {
            reactServerStream: renderStream,
            preinitScripts: ()=>{},
            clientReferenceManifest: clientReferenceManifest,
            ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
            ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
            nonce: nonce
        }), {
            signal: initialClientController.signal,
            onError: (err)=>{
                const digest = getDigestForWellKnownError(err);
                if (digest) {
                    return digest;
                }
                if (initialClientController.signal.aborted) {
                // These are expected errors that might error the prerender. we ignore them.
                } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                    // We don't normally log these errors because we are going to retry anyway but
                    // it can be useful for debugging Next.js itself to get visibility here when needed
                    printDebugThrownValueForProspectiveRender(err, route);
                }
            }
        });
        pendingInitialClientResult.catch((err)=>{
            if (initialClientController.signal.aborted) {
            // We aborted the render normally and can ignore this error
            } else {
                // We're going to retry to so we normally would suppress this error but
                // when verbose logging is on we print it
                if (process.env.__NEXT_VERBOSE_LOGGING) {
                    printDebugThrownValueForProspectiveRender(err, route);
                }
            }
        });
    }
    await cacheSignal.cacheReady();
    // It is important that we abort the SSR render first to avoid
    // connection closed errors from having an incomplete RSC stream
    initialClientController.abort();
    initialServerRenderController.abort();
    initialServerPrerenderController.abort();
    // We've now filled caches and triggered any inadvertent sync bailouts
    // due to lazy module initialization. We can restart our render to capture results
    const finalServerController = new AbortController();
    const serverDynamicTracking = createDynamicTrackingState(false);
    const finalServerPrerenderStore = {
        type: 'prerender',
        phase: 'render',
        rootParams,
        implicitTags: [],
        renderSignal: finalServerController.signal,
        controller: finalServerController,
        // During the final prerender we don't need to track cache access so we omit the signal
        cacheSignal: null,
        dynamicTracking: serverDynamicTracking,
        revalidate: INFINITE_CACHE,
        expire: INFINITE_CACHE,
        stale: INFINITE_CACHE,
        tags: [],
        prerenderResumeDataCache
    };
    const finalClientController = new AbortController();
    const clientDynamicTracking = createDynamicTrackingState(false);
    const dynamicValidation = createDynamicValidationState();
    const finalClientPrerenderStore = {
        type: 'prerender',
        phase: 'render',
        rootParams,
        implicitTags: [],
        renderSignal: finalClientController.signal,
        controller: finalClientController,
        // During the final prerender we don't need to track cache access so we omit the signal
        cacheSignal: null,
        dynamicTracking: clientDynamicTracking,
        revalidate: INFINITE_CACHE,
        expire: INFINITE_CACHE,
        stale: INFINITE_CACHE,
        tags: [],
        prerenderResumeDataCache
    };
    const finalServerPayload = await workUnitAsyncStorage.run(finalServerPrerenderStore, getRSCPayload, tree, ctx, isNotFound);
    const serverPrerenderStreamResult = await prerenderServerWithPhases(finalServerController.signal, ()=>workUnitAsyncStorage.run(finalServerPrerenderStore, ComponentMod.renderToReadableStream, finalServerPayload, clientReferenceManifest.clientModules, {
            onError: (err)=>{
                if (isUseCacheTimeoutError(err)) {
                    return err.digest;
                }
                if (finalServerController.signal.aborted && isPrerenderInterruptedError(err)) {
                    return err.digest;
                }
                return getDigestForWellKnownError(err);
            },
            signal: finalServerController.signal
        }), ()=>{
        finalServerController.abort();
    });
    let rootDidError = false;
    const serverPhasedStream = serverPrerenderStreamResult.asPhasedStream();
    try {
        const prerender = require('react-dom/static.edge').prerender;
        await prerenderClientWithPhases(()=>workUnitAsyncStorage.run(finalClientPrerenderStore, prerender, /*#__PURE__*/ _jsx(App, {
                reactServerStream: serverPhasedStream,
                preinitScripts: ()=>{},
                clientReferenceManifest: clientReferenceManifest,
                ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                nonce: ctx.nonce
            }), {
                signal: finalClientController.signal,
                onError: (err, errorInfo)=>{
                    if (isUseCacheTimeoutError(err)) {
                        dynamicValidation.dynamicErrors.push(err);
                        return;
                    }
                    if (isPrerenderInterruptedError(err) || finalClientController.signal.aborted) {
                        if (!rootDidError) {
                            // If the root errored before we observe this error then it wasn't caused by something dynamic.
                            // If the root did not error or is erroring because of a sync dynamic API or a prerender interrupt error
                            // then we are a dynamic route.
                            requestStore.usedDynamic = true;
                        }
                        const componentStack = errorInfo.componentStack;
                        if (typeof componentStack === 'string') {
                            trackAllowedDynamicAccess(route, componentStack, dynamicValidation, serverDynamicTracking, clientDynamicTracking);
                        }
                        return;
                    }
                    return getDigestForWellKnownError(err);
                }
            }), ()=>{
            finalClientController.abort();
            serverPhasedStream.assertExhausted();
        });
    } catch (err) {
        rootDidError = true;
        if (isPrerenderInterruptedError(err) || finalClientController.signal.aborted) {
        // we don't have a root because the abort errored in the root. We can just ignore this error
        } else {
        // If an error is thrown in the root before prerendering is aborted, we
        // don't want to rethrow it here, otherwise this would lead to a hanging
        // response and unhandled rejection. We also don't want to log it, because
        // it's most likely already logged as part of the normal render. So we
        // just fall through here, to make sure `resolveValidation` is called.
        }
    }
    function LogDynamicValidation() {
        try {
            throwIfDisallowedDynamic(route, dynamicValidation, serverDynamicTracking, clientDynamicTracking);
        } catch  {}
        return null;
    }
    resolveValidation(/*#__PURE__*/ _jsx(LogDynamicValidation, {}));
}
/**
 * Determines whether we should generate static flight data.
 */ function shouldGenerateStaticFlightData(workStore) {
    const { isStaticGeneration } = workStore;
    if (!isStaticGeneration) return false;
    return true;
}
async function prerenderToStream(req, res, ctx, metadata, workStore, tree, implicitTags) {
    // When prerendering formState is always null. We still include it
    // because some shared APIs expect a formState value and this is slightly
    // more explicit than making it an optional function argument
    const formState = null;
    const rootParams = getRootParams(tree, ctx.getDynamicParamFromSegment);
    const renderOpts = ctx.renderOpts;
    const ComponentMod = renderOpts.ComponentMod;
    // TODO: fix this typescript
    const clientReferenceManifest = renderOpts.clientReferenceManifest;
    const fallbackRouteParams = workStore.fallbackRouteParams;
    const { ServerInsertedHTMLProvider, renderServerInsertedHTML } = createServerInsertedHTML();
    const { ServerInsertedMetadataProvider, getServerInsertedMetadata } = createServerInsertedMetadata(ctx.nonce);
    const tracingMetadata = getTracedMetadata(getTracer().getTracePropagationData(), renderOpts.experimental.clientTraceMetadata);
    const polyfills = renderOpts.buildManifest.polyfillFiles.filter((polyfill)=>polyfill.endsWith('.js') && !polyfill.endsWith('.module.js')).map((polyfill)=>{
        var _renderOpts_subresourceIntegrityManifest;
        return {
            src: `${ctx.assetPrefix}/_next/${polyfill}${getAssetQueryString(ctx, false)}`,
            integrity: (_renderOpts_subresourceIntegrityManifest = renderOpts.subresourceIntegrityManifest) == null ? void 0 : _renderOpts_subresourceIntegrityManifest[polyfill],
            crossOrigin: renderOpts.crossOrigin,
            noModule: true,
            nonce: ctx.nonce
        };
    });
    const [preinitScripts, bootstrapScript] = getRequiredScripts(renderOpts.buildManifest, // Why is assetPrefix optional on renderOpts?
    // @TODO make it default empty string on renderOpts and get rid of it from ctx
    ctx.assetPrefix, renderOpts.crossOrigin, renderOpts.subresourceIntegrityManifest, getAssetQueryString(ctx, true), ctx.nonce, renderOpts.page);
    const reactServerErrorsByDigest = new Map();
    // We don't report errors during prerendering through our instrumentation hooks
    const silenceLogger = !!renderOpts.experimental.isRoutePPREnabled;
    function onHTMLRenderRSCError(err) {
        return renderOpts.onInstrumentationRequestError == null ? void 0 : renderOpts.onInstrumentationRequestError.call(renderOpts, err, req, createErrorContext(ctx, 'react-server-components'));
    }
    const serverComponentsErrorHandler = createHTMLReactServerErrorHandler(!!renderOpts.dev, !!renderOpts.nextExport, reactServerErrorsByDigest, silenceLogger, onHTMLRenderRSCError);
    function onHTMLRenderSSRError(err) {
        return renderOpts.onInstrumentationRequestError == null ? void 0 : renderOpts.onInstrumentationRequestError.call(renderOpts, err, req, createErrorContext(ctx, 'server-rendering'));
    }
    const allCapturedErrors = [];
    const htmlRendererErrorHandler = createHTMLErrorHandler(!!renderOpts.dev, !!renderOpts.nextExport, reactServerErrorsByDigest, allCapturedErrors, silenceLogger, onHTMLRenderSSRError);
    let reactServerPrerenderResult = null;
    const setMetadataHeader = (name)=>{
        metadata.headers ??= {};
        metadata.headers[name] = res.getHeader(name);
    };
    const setHeader = (name, value)=>{
        res.setHeader(name, value);
        setMetadataHeader(name);
        return res;
    };
    const appendHeader = (name, value)=>{
        if (Array.isArray(value)) {
            value.forEach((item)=>{
                res.appendHeader(name, item);
            });
        } else {
            res.appendHeader(name, value);
        }
        setMetadataHeader(name);
    };
    let prerenderStore = null;
    try {
        if (renderOpts.experimental.dynamicIO) {
            if (renderOpts.experimental.isRoutePPREnabled) {
                /**
         * dynamicIO with PPR
         *
         * The general approach is to render the RSC stream first allowing any cache reads to resolve.
         * Once we have settled all cache reads we restart the render and abort after a single Task.
         *
         * Unlike with the non PPR case we can't synchronously abort the render when a dynamic API is used
         * during the initial render because we need to ensure all caches can be filled as part of the initial Task
         * and a synchronous abort might prevent us from filling all caches.
         *
         * Once the render is complete we allow the SSR render to finish and use a combination of the postponed state
         * and the reactServerIsDynamic value to determine how to treat the resulting render
         */ // Prerender controller represents the lifetime of the prerender.
                // It will be aborted when a Task is complete or a synchronously aborting
                // API is called. Notably during cache-filling renders this does not actually
                // terminate the render itself which will continue until all caches are filled
                const initialServerPrerenderController = new AbortController();
                // This controller represents the lifetime of the React render call. Notably
                // during the cache-filling render it is different from the prerender controller
                // because we don't want to end the react render until all caches are filled.
                const initialServerRenderController = new AbortController();
                // The cacheSignal helps us track whether caches are still filling or we are ready
                // to cut the render off.
                const cacheSignal = new CacheSignal();
                // The resume data cache here should use a fresh instance as it's
                // performing a fresh prerender. If we get to implementing the
                // prerendering of an already prerendered page, we should use the passed
                // resume data cache instead.
                const prerenderResumeDataCache = createPrerenderResumeDataCache();
                const initialServerPrerenderStore = prerenderStore = {
                    type: 'prerender',
                    phase: 'render',
                    rootParams,
                    implicitTags: implicitTags,
                    renderSignal: initialServerRenderController.signal,
                    controller: initialServerPrerenderController,
                    cacheSignal,
                    dynamicTracking: null,
                    revalidate: INFINITE_CACHE,
                    expire: INFINITE_CACHE,
                    stale: INFINITE_CACHE,
                    tags: [
                        ...implicitTags
                    ],
                    prerenderResumeDataCache
                };
                // We're not going to use the result of this render because the only time it could be used
                // is if it completes in a microtask and that's likely very rare for any non-trivial app
                const initialServerPayload = await workUnitAsyncStorage.run(initialServerPrerenderStore, getRSCPayload, tree, ctx, res.statusCode === 404);
                const pendingInitialServerResult = workUnitAsyncStorage.run(initialServerPrerenderStore, ComponentMod.prerender, initialServerPayload, clientReferenceManifest.clientModules, {
                    onError: (err)=>{
                        const digest = getDigestForWellKnownError(err);
                        if (digest) {
                            return digest;
                        }
                        if (initialServerPrerenderController.signal.aborted) {
                            // The render aborted before this error was handled which indicates
                            // the error is caused by unfinished components within the render
                            return;
                        } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                            printDebugThrownValueForProspectiveRender(err, workStore.route);
                        }
                    },
                    // we don't care to track postpones during the prospective render because we need
                    // to always do a final render anyway
                    onPostpone: undefined,
                    // We don't want to stop rendering until the cacheSignal is complete so we pass
                    // a different signal to this render call than is used by dynamic APIs to signify
                    // transitioning out of the prerender environment
                    signal: initialServerRenderController.signal
                });
                await cacheSignal.cacheReady();
                initialServerRenderController.abort();
                initialServerPrerenderController.abort();
                let initialServerResult;
                try {
                    initialServerResult = await createReactServerPrerenderResult(pendingInitialServerResult);
                } catch (err) {
                    if (initialServerRenderController.signal.aborted || initialServerPrerenderController.signal.aborted) {
                    // These are expected errors that might error the prerender. we ignore them.
                    } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                        // We don't normally log these errors because we are going to retry anyway but
                        // it can be useful for debugging Next.js itself to get visibility here when needed
                        printDebugThrownValueForProspectiveRender(err, workStore.route);
                    }
                }
                if (initialServerResult) {
                    // Before we attempt the SSR initial render we need to ensure all client modules
                    // are already loaded.
                    await warmFlightResponse(initialServerResult.asStream(), clientReferenceManifest);
                    const initialClientController = new AbortController();
                    const initialClientPrerenderStore = {
                        type: 'prerender',
                        phase: 'render',
                        rootParams,
                        implicitTags: implicitTags,
                        renderSignal: initialClientController.signal,
                        controller: initialClientController,
                        cacheSignal: null,
                        dynamicTracking: null,
                        revalidate: INFINITE_CACHE,
                        expire: INFINITE_CACHE,
                        stale: INFINITE_CACHE,
                        tags: [
                            ...implicitTags
                        ],
                        prerenderResumeDataCache
                    };
                    const prerender = require('react-dom/static.edge').prerender;
                    await prerenderAndAbortInSequentialTasks(()=>workUnitAsyncStorage.run(initialClientPrerenderStore, prerender, /*#__PURE__*/ _jsx(App, {
                            reactServerStream: initialServerResult.asUnclosingStream(),
                            preinitScripts: preinitScripts,
                            clientReferenceManifest: clientReferenceManifest,
                            ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                            ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                            nonce: ctx.nonce
                        }), {
                            signal: initialClientController.signal,
                            onError: (err)=>{
                                const digest = getDigestForWellKnownError(err);
                                if (digest) {
                                    return digest;
                                }
                                if (initialClientController.signal.aborted) {
                                // These are expected errors that might error the prerender. we ignore them.
                                } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                                    // We don't normally log these errors because we are going to retry anyway but
                                    // it can be useful for debugging Next.js itself to get visibility here when needed
                                    printDebugThrownValueForProspectiveRender(err, workStore.route);
                                }
                            },
                            bootstrapScripts: [
                                bootstrapScript
                            ]
                        }), ()=>{
                        initialClientController.abort();
                    }).catch((err)=>{
                        if (initialServerRenderController.signal.aborted || isPrerenderInterruptedError(err)) {
                        // These are expected errors that might error the prerender. we ignore them.
                        } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                            // We don't normally log these errors because we are going to retry anyway but
                            // it can be useful for debugging Next.js itself to get visibility here when needed
                            printDebugThrownValueForProspectiveRender(err, workStore.route);
                        }
                    });
                }
                let serverIsDynamic = false;
                const finalServerController = new AbortController();
                const serverDynamicTracking = createDynamicTrackingState(renderOpts.isDebugDynamicAccesses);
                const finalRenderPrerenderStore = prerenderStore = {
                    type: 'prerender',
                    phase: 'render',
                    rootParams,
                    implicitTags: implicitTags,
                    renderSignal: finalServerController.signal,
                    controller: finalServerController,
                    // During the final prerender we don't need to track cache access so we omit the signal
                    cacheSignal: null,
                    dynamicTracking: serverDynamicTracking,
                    revalidate: INFINITE_CACHE,
                    expire: INFINITE_CACHE,
                    stale: INFINITE_CACHE,
                    tags: [
                        ...implicitTags
                    ],
                    prerenderResumeDataCache
                };
                const finalAttemptRSCPayload = await workUnitAsyncStorage.run(finalRenderPrerenderStore, getRSCPayload, tree, ctx, res.statusCode === 404);
                let prerenderIsPending = true;
                const reactServerResult = reactServerPrerenderResult = await createReactServerPrerenderResult(prerenderAndAbortInSequentialTasks(async ()=>{
                    const prerenderResult = await workUnitAsyncStorage.run(// The store to scope
                    finalRenderPrerenderStore, // The function to run
                    ComponentMod.prerender, // ... the arguments for the function to run
                    finalAttemptRSCPayload, clientReferenceManifest.clientModules, {
                        onError: (err)=>{
                            return serverComponentsErrorHandler(err);
                        },
                        signal: finalServerController.signal
                    });
                    prerenderIsPending = false;
                    return prerenderResult;
                }, ()=>{
                    if (finalServerController.signal.aborted) {
                        // If the server controller is already aborted we must have called something
                        // that required aborting the prerender synchronously such as with new Date()
                        serverIsDynamic = true;
                        return;
                    }
                    if (prerenderIsPending) {
                        // If prerenderIsPending then we have blocked for longer than a Task and we assume
                        // there is something unfinished.
                        serverIsDynamic = true;
                    }
                    finalServerController.abort();
                }));
                const clientDynamicTracking = createDynamicTrackingState(renderOpts.isDebugDynamicAccesses);
                const finalClientController = new AbortController();
                const finalClientPrerenderStore = {
                    type: 'prerender',
                    phase: 'render',
                    rootParams,
                    implicitTags: implicitTags,
                    renderSignal: finalClientController.signal,
                    controller: finalClientController,
                    // For HTML Generation we don't need to track cache reads (RSC only)
                    cacheSignal: null,
                    dynamicTracking: clientDynamicTracking,
                    revalidate: INFINITE_CACHE,
                    expire: INFINITE_CACHE,
                    stale: INFINITE_CACHE,
                    tags: [
                        ...implicitTags
                    ],
                    prerenderResumeDataCache
                };
                let clientIsDynamic = false;
                let dynamicValidation = createDynamicValidationState();
                const prerender = require('react-dom/static.edge').prerender;
                let { prelude, postponed } = await prerenderAndAbortInSequentialTasks(()=>workUnitAsyncStorage.run(finalClientPrerenderStore, prerender, /*#__PURE__*/ _jsx(App, {
                        reactServerStream: reactServerResult.asUnclosingStream(),
                        preinitScripts: preinitScripts,
                        clientReferenceManifest: clientReferenceManifest,
                        ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                        ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                        nonce: ctx.nonce
                    }), {
                        signal: finalClientController.signal,
                        onError: (err, errorInfo)=>{
                            if (isPrerenderInterruptedError(err) || finalClientController.signal.aborted) {
                                clientIsDynamic = true;
                                const componentStack = errorInfo.componentStack;
                                if (typeof componentStack === 'string') {
                                    trackAllowedDynamicAccess(workStore.route, componentStack, dynamicValidation, serverDynamicTracking, clientDynamicTracking);
                                }
                                return;
                            }
                            return htmlRendererErrorHandler(err, errorInfo);
                        },
                        onHeaders: (headers)=>{
                            headers.forEach((value, key)=>{
                                appendHeader(key, value);
                            });
                        },
                        maxHeadersLength: renderOpts.reactMaxHeadersLength,
                        bootstrapScripts: [
                            bootstrapScript
                        ]
                    }), ()=>{
                    finalClientController.abort();
                });
                throwIfDisallowedDynamic(workStore.route, dynamicValidation, serverDynamicTracking, clientDynamicTracking);
                const getServerInsertedHTML = makeGetServerInsertedHTML({
                    polyfills,
                    renderServerInsertedHTML,
                    serverCapturedErrors: allCapturedErrors,
                    basePath: renderOpts.basePath,
                    tracingMetadata: tracingMetadata
                });
                const flightData = await streamToBuffer(reactServerResult.asStream());
                metadata.flightData = flightData;
                metadata.segmentData = await collectSegmentData(flightData, finalRenderPrerenderStore, ComponentMod, renderOpts, fallbackRouteParams);
                if (serverIsDynamic || clientIsDynamic) {
                    if (postponed != null) {
                        // Dynamic HTML case
                        metadata.postponed = await getDynamicHTMLPostponedState(postponed, fallbackRouteParams, prerenderResumeDataCache);
                    } else {
                        // Dynamic Data case
                        metadata.postponed = await getDynamicDataPostponedState(prerenderResumeDataCache);
                    }
                    reactServerResult.consume();
                    return {
                        digestErrorsMap: reactServerErrorsByDigest,
                        ssrErrors: allCapturedErrors,
                        stream: await continueDynamicPrerender(prelude, {
                            getServerInsertedHTML,
                            getServerInsertedMetadata
                        }),
                        dynamicAccess: consumeDynamicAccess(serverDynamicTracking, clientDynamicTracking),
                        // TODO: Should this include the SSR pass?
                        collectedRevalidate: finalRenderPrerenderStore.revalidate,
                        collectedExpire: finalRenderPrerenderStore.expire,
                        collectedStale: finalRenderPrerenderStore.stale,
                        collectedTags: finalRenderPrerenderStore.tags
                    };
                } else {
                    // Static case
                    if (workStore.forceDynamic) {
                        throw Object.defineProperty(new StaticGenBailoutError('Invariant: a Page with `dynamic = "force-dynamic"` did not trigger the dynamic pathway. This is a bug in Next.js'), "__NEXT_ERROR_CODE", {
                            value: "E598",
                            enumerable: false,
                            configurable: true
                        });
                    }
                    let htmlStream = prelude;
                    if (postponed != null) {
                        // We postponed but nothing dynamic was used. We resume the render now and immediately abort it
                        // so we can set all the postponed boundaries to client render mode before we store the HTML response
                        const resume = require('react-dom/server.edge').resume;
                        // We don't actually want to render anything so we just pass a stream
                        // that never resolves. The resume call is going to abort immediately anyway
                        const foreverStream = new ReadableStream();
                        const resumeStream = await resume(/*#__PURE__*/ _jsx(App, {
                            reactServerStream: foreverStream,
                            preinitScripts: ()=>{},
                            clientReferenceManifest: clientReferenceManifest,
                            ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                            ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                            nonce: ctx.nonce
                        }), JSON.parse(JSON.stringify(postponed)), {
                            signal: createPostponedAbortSignal('static prerender resume'),
                            onError: htmlRendererErrorHandler,
                            nonce: ctx.nonce
                        });
                        // First we write everything from the prerender, then we write everything from the aborted resume render
                        htmlStream = chainStreams(prelude, resumeStream);
                    }
                    return {
                        digestErrorsMap: reactServerErrorsByDigest,
                        ssrErrors: allCapturedErrors,
                        stream: await continueStaticPrerender(htmlStream, {
                            inlinedDataStream: createInlinedDataReadableStream(reactServerResult.consumeAsStream(), ctx.nonce, formState),
                            getServerInsertedHTML,
                            getServerInsertedMetadata
                        }),
                        dynamicAccess: consumeDynamicAccess(serverDynamicTracking, clientDynamicTracking),
                        // TODO: Should this include the SSR pass?
                        collectedRevalidate: finalRenderPrerenderStore.revalidate,
                        collectedExpire: finalRenderPrerenderStore.expire,
                        collectedStale: finalRenderPrerenderStore.stale,
                        collectedTags: finalRenderPrerenderStore.tags
                    };
                }
            } else {
                /**
         * dynamicIO without PPR
         *
         * The general approach is to render the RSC tree first allowing for any inflight
         * caches to resolve. Once we have settled inflight caches we can check and see if any
         * synchronous dynamic APIs were used. If so we don't need to bother doing anything more
         * because the page will be dynamic on re-render anyway
         *
         * If no sync dynamic APIs were used we then re-render and abort after a single Task.
         * If the render errors we know that the page has some dynamic IO. This assumes and relies
         * upon caches reading from a in process memory cache and resolving in a microtask. While this
         * is true from our own default cache implementation and if you don't exceed our LRU size it
         * might not be true for custom cache implementations.
         *
         * Future implementations can do some different strategies during build like using IPC to
         * synchronously fill caches during this special rendering mode. For now this heuristic should work
         */ const cache = workStore.incrementalCache;
                if (!cache) {
                    throw Object.defineProperty(new Error('Expected incremental cache to exist. This is a bug in Next.js'), "__NEXT_ERROR_CODE", {
                        value: "E205",
                        enumerable: false,
                        configurable: true
                    });
                }
                // Prerender controller represents the lifetime of the prerender.
                // It will be aborted when a Task is complete or a synchronously aborting
                // API is called. Notably during cache-filling renders this does not actually
                // terminate the render itself which will continue until all caches are filled
                const initialServerPrerenderController = new AbortController();
                // This controller represents the lifetime of the React render call. Notably
                // during the cache-filling render it is different from the prerender controller
                // because we don't want to end the react render until all caches are filled.
                const initialServerRenderController = new AbortController();
                const cacheSignal = new CacheSignal();
                const prerenderResumeDataCache = createPrerenderResumeDataCache();
                const initialServerPrerenderStore = prerenderStore = {
                    type: 'prerender',
                    phase: 'render',
                    rootParams,
                    implicitTags: implicitTags,
                    renderSignal: initialServerRenderController.signal,
                    controller: initialServerPrerenderController,
                    cacheSignal,
                    dynamicTracking: null,
                    revalidate: INFINITE_CACHE,
                    expire: INFINITE_CACHE,
                    stale: INFINITE_CACHE,
                    tags: [
                        ...implicitTags
                    ],
                    prerenderResumeDataCache
                };
                const initialClientController = new AbortController();
                const initialClientPrerenderStore = prerenderStore = {
                    type: 'prerender',
                    phase: 'render',
                    rootParams,
                    implicitTags: implicitTags,
                    renderSignal: initialClientController.signal,
                    controller: initialClientController,
                    cacheSignal,
                    dynamicTracking: null,
                    revalidate: INFINITE_CACHE,
                    expire: INFINITE_CACHE,
                    stale: INFINITE_CACHE,
                    tags: [
                        ...implicitTags
                    ],
                    prerenderResumeDataCache
                };
                // We're not going to use the result of this render because the only time it could be used
                // is if it completes in a microtask and that's likely very rare for any non-trivial app
                const firstAttemptRSCPayload = await workUnitAsyncStorage.run(initialServerPrerenderStore, getRSCPayload, tree, ctx, res.statusCode === 404);
                let initialServerStream;
                try {
                    initialServerStream = workUnitAsyncStorage.run(initialServerPrerenderStore, ComponentMod.renderToReadableStream, firstAttemptRSCPayload, clientReferenceManifest.clientModules, {
                        onError: (err)=>{
                            const digest = getDigestForWellKnownError(err);
                            if (digest) {
                                return digest;
                            }
                            if (initialServerPrerenderController.signal.aborted || initialServerRenderController.signal.aborted) {
                                // The render aborted before this error was handled which indicates
                                // the error is caused by unfinished components within the render
                                return;
                            } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                                printDebugThrownValueForProspectiveRender(err, workStore.route);
                            }
                        },
                        signal: initialServerRenderController.signal
                    });
                } catch (err) {
                    if (initialServerPrerenderController.signal.aborted || initialServerRenderController.signal.aborted) {
                    // These are expected errors that might error the prerender. we ignore them.
                    } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                        // We don't normally log these errors because we are going to retry anyway but
                        // it can be useful for debugging Next.js itself to get visibility here when needed
                        printDebugThrownValueForProspectiveRender(err, workStore.route);
                    }
                }
                if (initialServerStream) {
                    const [warmupStream, renderStream] = initialServerStream.tee();
                    initialServerStream = null;
                    // Before we attempt the SSR initial render we need to ensure all client modules
                    // are already loaded.
                    await warmFlightResponse(warmupStream, clientReferenceManifest);
                    const prerender = require('react-dom/static.edge').prerender;
                    const pendingInitialClientResult = workUnitAsyncStorage.run(initialClientPrerenderStore, prerender, /*#__PURE__*/ _jsx(App, {
                        reactServerStream: renderStream,
                        preinitScripts: preinitScripts,
                        clientReferenceManifest: clientReferenceManifest,
                        ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                        ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                        nonce: ctx.nonce
                    }), {
                        signal: initialClientController.signal,
                        onError: (err)=>{
                            const digest = getDigestForWellKnownError(err);
                            if (digest) {
                                return digest;
                            }
                            if (initialClientController.signal.aborted) {
                            // These are expected errors that might error the prerender. we ignore them.
                            } else if (process.env.NEXT_DEBUG_BUILD || process.env.__NEXT_VERBOSE_LOGGING) {
                                // We don't normally log these errors because we are going to retry anyway but
                                // it can be useful for debugging Next.js itself to get visibility here when needed
                                printDebugThrownValueForProspectiveRender(err, workStore.route);
                            }
                        },
                        bootstrapScripts: [
                            bootstrapScript
                        ]
                    });
                    pendingInitialClientResult.catch((err)=>{
                        if (initialClientController.signal.aborted) {
                        // We aborted the render normally and can ignore this error
                        } else {
                            // We're going to retry to so we normally would suppress this error but
                            // when verbose logging is on we print it
                            if (process.env.__NEXT_VERBOSE_LOGGING) {
                                printDebugThrownValueForProspectiveRender(err, workStore.route);
                            }
                        }
                    });
                }
                await cacheSignal.cacheReady();
                // It is important that we abort the SSR render first to avoid
                // connection closed errors from having an incomplete RSC stream
                initialClientController.abort();
                initialServerRenderController.abort();
                initialServerPrerenderController.abort();
                // We've now filled caches and triggered any inadvertant sync bailouts
                // due to lazy module initialization. We can restart our render to capture results
                let serverIsDynamic = false;
                const finalServerController = new AbortController();
                const serverDynamicTracking = createDynamicTrackingState(renderOpts.isDebugDynamicAccesses);
                const finalServerPrerenderStore = prerenderStore = {
                    type: 'prerender',
                    phase: 'render',
                    rootParams,
                    implicitTags: implicitTags,
                    renderSignal: finalServerController.signal,
                    controller: finalServerController,
                    // During the final prerender we don't need to track cache access so we omit the signal
                    cacheSignal: null,
                    dynamicTracking: serverDynamicTracking,
                    revalidate: INFINITE_CACHE,
                    expire: INFINITE_CACHE,
                    stale: INFINITE_CACHE,
                    tags: [
                        ...implicitTags
                    ],
                    prerenderResumeDataCache
                };
                let clientIsDynamic = false;
                const finalClientController = new AbortController();
                const clientDynamicTracking = createDynamicTrackingState(renderOpts.isDebugDynamicAccesses);
                const dynamicValidation = createDynamicValidationState();
                const finalClientPrerenderStore = prerenderStore = {
                    type: 'prerender',
                    phase: 'render',
                    rootParams,
                    implicitTags: implicitTags,
                    renderSignal: finalClientController.signal,
                    controller: finalClientController,
                    // During the final prerender we don't need to track cache access so we omit the signal
                    cacheSignal: null,
                    dynamicTracking: clientDynamicTracking,
                    revalidate: INFINITE_CACHE,
                    expire: INFINITE_CACHE,
                    stale: INFINITE_CACHE,
                    tags: [
                        ...implicitTags
                    ],
                    prerenderResumeDataCache
                };
                const finalServerPayload = await workUnitAsyncStorage.run(finalServerPrerenderStore, getRSCPayload, tree, ctx, res.statusCode === 404);
                const serverPrerenderStreamResult = reactServerPrerenderResult = await prerenderServerWithPhases(finalServerController.signal, ()=>workUnitAsyncStorage.run(finalServerPrerenderStore, ComponentMod.renderToReadableStream, finalServerPayload, clientReferenceManifest.clientModules, {
                        onError: (err)=>{
                            if (finalServerController.signal.aborted) {
                                serverIsDynamic = true;
                                if (isPrerenderInterruptedError(err)) {
                                    return err.digest;
                                }
                                return getDigestForWellKnownError(err);
                            }
                            return serverComponentsErrorHandler(err);
                        },
                        signal: finalServerController.signal
                    }), ()=>{
                    finalServerController.abort();
                });
                let htmlStream;
                const serverPhasedStream = serverPrerenderStreamResult.asPhasedStream();
                try {
                    const prerender = require('react-dom/static.edge').prerender;
                    const result = await prerenderClientWithPhases(()=>workUnitAsyncStorage.run(finalClientPrerenderStore, prerender, /*#__PURE__*/ _jsx(App, {
                            reactServerStream: serverPhasedStream,
                            preinitScripts: preinitScripts,
                            clientReferenceManifest: clientReferenceManifest,
                            ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                            ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                            nonce: ctx.nonce
                        }), {
                            signal: finalClientController.signal,
                            onError: (err, errorInfo)=>{
                                if (isPrerenderInterruptedError(err) || finalClientController.signal.aborted) {
                                    clientIsDynamic = true;
                                    const componentStack = errorInfo.componentStack;
                                    if (typeof componentStack === 'string') {
                                        trackAllowedDynamicAccess(workStore.route, componentStack, dynamicValidation, serverDynamicTracking, clientDynamicTracking);
                                    }
                                    return;
                                }
                                return htmlRendererErrorHandler(err, errorInfo);
                            },
                            bootstrapScripts: [
                                bootstrapScript
                            ]
                        }), ()=>{
                        finalClientController.abort();
                        serverPhasedStream.assertExhausted();
                    });
                    htmlStream = result.prelude;
                } catch (err) {
                    if (isPrerenderInterruptedError(err) || finalClientController.signal.aborted) {
                    // we don't have a root because the abort errored in the root. We can just ignore this error
                    } else {
                        // This error is something else and should bubble up
                        throw err;
                    }
                }
                throwIfDisallowedDynamic(workStore.route, dynamicValidation, serverDynamicTracking, clientDynamicTracking);
                if (serverIsDynamic || clientIsDynamic) {
                    const dynamicReason = serverIsDynamic ? getFirstDynamicReason(serverDynamicTracking) : getFirstDynamicReason(clientDynamicTracking);
                    if (dynamicReason) {
                        throw Object.defineProperty(new DynamicServerError(`Route "${workStore.route}" couldn't be rendered statically because it used \`${dynamicReason}\`. See more info here: https://nextjs.org/docs/messages/next-prerender-data`), "__NEXT_ERROR_CODE", {
                            value: "E586",
                            enumerable: false,
                            configurable: true
                        });
                    } else {
                        throw Object.defineProperty(new DynamicServerError(`Route "${workStore.route}" couldn't be rendered statically it accessed data without explicitly caching it. See more info here: https://nextjs.org/docs/messages/next-prerender-data`), "__NEXT_ERROR_CODE", {
                            value: "E583",
                            enumerable: false,
                            configurable: true
                        });
                    }
                }
                const flightData = await streamToBuffer(serverPrerenderStreamResult.asStream());
                metadata.flightData = flightData;
                metadata.segmentData = await collectSegmentData(flightData, finalClientPrerenderStore, ComponentMod, renderOpts, fallbackRouteParams);
                const getServerInsertedHTML = makeGetServerInsertedHTML({
                    polyfills,
                    renderServerInsertedHTML,
                    serverCapturedErrors: allCapturedErrors,
                    basePath: renderOpts.basePath,
                    tracingMetadata: tracingMetadata
                });
                const validateRootLayout = renderOpts.dev;
                return {
                    digestErrorsMap: reactServerErrorsByDigest,
                    ssrErrors: allCapturedErrors,
                    stream: await continueFizzStream(htmlStream, {
                        inlinedDataStream: createInlinedDataReadableStream(serverPrerenderStreamResult.asStream(), ctx.nonce, formState),
                        isStaticGeneration: true,
                        getServerInsertedHTML,
                        getServerInsertedMetadata,
                        validateRootLayout
                    }),
                    dynamicAccess: consumeDynamicAccess(serverDynamicTracking, clientDynamicTracking),
                    // TODO: Should this include the SSR pass?
                    collectedRevalidate: finalServerPrerenderStore.revalidate,
                    collectedExpire: finalServerPrerenderStore.expire,
                    collectedStale: finalServerPrerenderStore.stale,
                    collectedTags: finalServerPrerenderStore.tags
                };
            }
        } else if (renderOpts.experimental.isRoutePPREnabled) {
            // We're statically generating with PPR and need to do dynamic tracking
            let dynamicTracking = createDynamicTrackingState(renderOpts.isDebugDynamicAccesses);
            const prerenderResumeDataCache = createPrerenderResumeDataCache();
            const reactServerPrerenderStore = prerenderStore = {
                type: 'prerender-ppr',
                phase: 'render',
                rootParams,
                implicitTags: implicitTags,
                dynamicTracking,
                revalidate: INFINITE_CACHE,
                expire: INFINITE_CACHE,
                stale: INFINITE_CACHE,
                tags: [
                    ...implicitTags
                ],
                prerenderResumeDataCache
            };
            const RSCPayload = await workUnitAsyncStorage.run(reactServerPrerenderStore, getRSCPayload, tree, ctx, res.statusCode === 404);
            const reactServerResult = reactServerPrerenderResult = await createReactServerPrerenderResultFromRender(workUnitAsyncStorage.run(reactServerPrerenderStore, ComponentMod.renderToReadableStream, // ... the arguments for the function to run
            RSCPayload, clientReferenceManifest.clientModules, {
                onError: serverComponentsErrorHandler
            }));
            const ssrPrerenderStore = {
                type: 'prerender-ppr',
                phase: 'render',
                rootParams,
                implicitTags: implicitTags,
                dynamicTracking,
                revalidate: INFINITE_CACHE,
                expire: INFINITE_CACHE,
                stale: INFINITE_CACHE,
                tags: [
                    ...implicitTags
                ],
                prerenderResumeDataCache
            };
            const prerender = require('react-dom/static.edge').prerender;
            const { prelude, postponed } = await workUnitAsyncStorage.run(ssrPrerenderStore, prerender, /*#__PURE__*/ _jsx(App, {
                reactServerStream: reactServerResult.asUnclosingStream(),
                preinitScripts: preinitScripts,
                clientReferenceManifest: clientReferenceManifest,
                ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                nonce: ctx.nonce
            }), {
                onError: htmlRendererErrorHandler,
                onHeaders: (headers)=>{
                    headers.forEach((value, key)=>{
                        appendHeader(key, value);
                    });
                },
                maxHeadersLength: renderOpts.reactMaxHeadersLength,
                bootstrapScripts: [
                    bootstrapScript
                ]
            });
            const getServerInsertedHTML = makeGetServerInsertedHTML({
                polyfills,
                renderServerInsertedHTML,
                serverCapturedErrors: allCapturedErrors,
                basePath: renderOpts.basePath,
                tracingMetadata: tracingMetadata
            });
            // After awaiting here we've waited for the entire RSC render to complete. Crucially this means
            // that when we detect whether we've used dynamic APIs below we know we'll have picked up even
            // parts of the React Server render that might not be used in the SSR render.
            const flightData = await streamToBuffer(reactServerResult.asStream());
            if (shouldGenerateStaticFlightData(workStore)) {
                metadata.flightData = flightData;
                metadata.segmentData = await collectSegmentData(flightData, ssrPrerenderStore, ComponentMod, renderOpts, fallbackRouteParams);
            }
            /**
       * When prerendering there are three outcomes to consider
       *
       *   Dynamic HTML:      The prerender has dynamic holes (caused by using Next.js Dynamic Rendering APIs)
       *                      We will need to resume this result when requests are handled and we don't include
       *                      any server inserted HTML or inlined flight data in the static HTML
       *
       *   Dynamic Data:      The prerender has no dynamic holes but dynamic APIs were used. We will not
       *                      resume this render when requests are handled but we will generate new inlined
       *                      flight data since it is dynamic and differences may end up reconciling on the client
       *
       *   Static:            The prerender has no dynamic holes and no dynamic APIs were used. We statically encode
       *                      all server inserted HTML and flight data
       */ // First we check if we have any dynamic holes in our HTML prerender
            if (accessedDynamicData(dynamicTracking.dynamicAccesses)) {
                if (postponed != null) {
                    // Dynamic HTML case.
                    metadata.postponed = await getDynamicHTMLPostponedState(postponed, fallbackRouteParams, prerenderResumeDataCache);
                } else {
                    // Dynamic Data case.
                    metadata.postponed = await getDynamicDataPostponedState(prerenderResumeDataCache);
                }
                // Regardless of whether this is the Dynamic HTML or Dynamic Data case we need to ensure we include
                // server inserted html in the static response because the html that is part of the prerender may depend on it
                // It is possible in the set of stream transforms for Dynamic HTML vs Dynamic Data may differ but currently both states
                // require the same set so we unify the code path here
                reactServerResult.consume();
                return {
                    digestErrorsMap: reactServerErrorsByDigest,
                    ssrErrors: allCapturedErrors,
                    stream: await continueDynamicPrerender(prelude, {
                        getServerInsertedHTML,
                        getServerInsertedMetadata
                    }),
                    dynamicAccess: dynamicTracking.dynamicAccesses,
                    // TODO: Should this include the SSR pass?
                    collectedRevalidate: reactServerPrerenderStore.revalidate,
                    collectedExpire: reactServerPrerenderStore.expire,
                    collectedStale: reactServerPrerenderStore.stale,
                    collectedTags: reactServerPrerenderStore.tags
                };
            } else if (fallbackRouteParams && fallbackRouteParams.size > 0) {
                // Rendering the fallback case.
                metadata.postponed = await getDynamicDataPostponedState(prerenderResumeDataCache);
                return {
                    digestErrorsMap: reactServerErrorsByDigest,
                    ssrErrors: allCapturedErrors,
                    stream: await continueDynamicPrerender(prelude, {
                        getServerInsertedHTML,
                        getServerInsertedMetadata
                    }),
                    dynamicAccess: dynamicTracking.dynamicAccesses,
                    // TODO: Should this include the SSR pass?
                    collectedRevalidate: reactServerPrerenderStore.revalidate,
                    collectedExpire: reactServerPrerenderStore.expire,
                    collectedStale: reactServerPrerenderStore.stale,
                    collectedTags: reactServerPrerenderStore.tags
                };
            } else {
                // Static case
                // We still have not used any dynamic APIs. At this point we can produce an entirely static prerender response
                if (workStore.forceDynamic) {
                    throw Object.defineProperty(new StaticGenBailoutError('Invariant: a Page with `dynamic = "force-dynamic"` did not trigger the dynamic pathway. This is a bug in Next.js'), "__NEXT_ERROR_CODE", {
                        value: "E598",
                        enumerable: false,
                        configurable: true
                    });
                }
                let htmlStream = prelude;
                if (postponed != null) {
                    // We postponed but nothing dynamic was used. We resume the render now and immediately abort it
                    // so we can set all the postponed boundaries to client render mode before we store the HTML response
                    const resume = require('react-dom/server.edge').resume;
                    // We don't actually want to render anything so we just pass a stream
                    // that never resolves. The resume call is going to abort immediately anyway
                    const foreverStream = new ReadableStream();
                    const resumeStream = await resume(/*#__PURE__*/ _jsx(App, {
                        reactServerStream: foreverStream,
                        preinitScripts: ()=>{},
                        clientReferenceManifest: clientReferenceManifest,
                        ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                        ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                        nonce: ctx.nonce
                    }), JSON.parse(JSON.stringify(postponed)), {
                        signal: createPostponedAbortSignal('static prerender resume'),
                        onError: htmlRendererErrorHandler,
                        nonce: ctx.nonce
                    });
                    // First we write everything from the prerender, then we write everything from the aborted resume render
                    htmlStream = chainStreams(prelude, resumeStream);
                }
                return {
                    digestErrorsMap: reactServerErrorsByDigest,
                    ssrErrors: allCapturedErrors,
                    stream: await continueStaticPrerender(htmlStream, {
                        inlinedDataStream: createInlinedDataReadableStream(reactServerResult.consumeAsStream(), ctx.nonce, formState),
                        getServerInsertedHTML,
                        getServerInsertedMetadata
                    }),
                    dynamicAccess: dynamicTracking.dynamicAccesses,
                    // TODO: Should this include the SSR pass?
                    collectedRevalidate: reactServerPrerenderStore.revalidate,
                    collectedExpire: reactServerPrerenderStore.expire,
                    collectedStale: reactServerPrerenderStore.stale,
                    collectedTags: reactServerPrerenderStore.tags
                };
            }
        } else {
            const prerenderLegacyStore = prerenderStore = {
                type: 'prerender-legacy',
                phase: 'render',
                rootParams,
                implicitTags: implicitTags,
                revalidate: INFINITE_CACHE,
                expire: INFINITE_CACHE,
                stale: INFINITE_CACHE,
                tags: [
                    ...implicitTags
                ]
            };
            // This is a regular static generation. We don't do dynamic tracking because we rely on
            // the old-school dynamic error handling to bail out of static generation
            const RSCPayload = await workUnitAsyncStorage.run(prerenderLegacyStore, getRSCPayload, tree, ctx, res.statusCode === 404);
            const reactServerResult = reactServerPrerenderResult = await createReactServerPrerenderResultFromRender(workUnitAsyncStorage.run(prerenderLegacyStore, ComponentMod.renderToReadableStream, RSCPayload, clientReferenceManifest.clientModules, {
                onError: serverComponentsErrorHandler
            }));
            const renderToReadableStream = require('react-dom/server.edge').renderToReadableStream;
            const htmlStream = await workUnitAsyncStorage.run(prerenderLegacyStore, renderToReadableStream, /*#__PURE__*/ _jsx(App, {
                reactServerStream: reactServerResult.asUnclosingStream(),
                preinitScripts: preinitScripts,
                clientReferenceManifest: clientReferenceManifest,
                ServerInsertedHTMLProvider: ServerInsertedHTMLProvider,
                ServerInsertedMetadataProvider: ServerInsertedMetadataProvider,
                nonce: ctx.nonce
            }), {
                onError: htmlRendererErrorHandler,
                nonce: ctx.nonce,
                bootstrapScripts: [
                    bootstrapScript
                ]
            });
            if (shouldGenerateStaticFlightData(workStore)) {
                const flightData = await streamToBuffer(reactServerResult.asStream());
                metadata.flightData = flightData;
                metadata.segmentData = await collectSegmentData(flightData, prerenderLegacyStore, ComponentMod, renderOpts, fallbackRouteParams);
            }
            const getServerInsertedHTML = makeGetServerInsertedHTML({
                polyfills,
                renderServerInsertedHTML,
                serverCapturedErrors: allCapturedErrors,
                basePath: renderOpts.basePath,
                tracingMetadata: tracingMetadata
            });
            return {
                digestErrorsMap: reactServerErrorsByDigest,
                ssrErrors: allCapturedErrors,
                stream: await continueFizzStream(htmlStream, {
                    inlinedDataStream: createInlinedDataReadableStream(reactServerResult.consumeAsStream(), ctx.nonce, formState),
                    isStaticGeneration: true,
                    getServerInsertedHTML,
                    getServerInsertedMetadata
                }),
                // TODO: Should this include the SSR pass?
                collectedRevalidate: prerenderLegacyStore.revalidate,
                collectedExpire: prerenderLegacyStore.expire,
                collectedStale: prerenderLegacyStore.stale,
                collectedTags: prerenderLegacyStore.tags
            };
        }
    } catch (err) {
        if (isStaticGenBailoutError(err) || typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string' && err.message.includes('https://nextjs.org/docs/advanced-features/static-html-export')) {
            // Ensure that "next dev" prints the red error overlay
            throw err;
        }
        // If this is a static generation error, we need to throw it so that it
        // can be handled by the caller if we're in static generation mode.
        if (isDynamicServerError(err)) {
            throw err;
        }
        // If a bailout made it to this point, it means it wasn't wrapped inside
        // a suspense boundary.
        const shouldBailoutToCSR = isBailoutToCSRError(err);
        if (shouldBailoutToCSR) {
            const stack = getStackWithoutErrorMessage(err);
            error(`${err.reason} should be wrapped in a suspense boundary at page "${ctx.pagePath}". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout\n${stack}`);
            throw err;
        }
        // If we errored when we did not have an RSC stream to read from. This is
        // not just a render error, we need to throw early.
        if (reactServerPrerenderResult === null) {
            throw err;
        }
        let errorType;
        if (isHTTPAccessFallbackError(err)) {
            res.statusCode = getAccessFallbackHTTPStatus(err);
            errorType = getAccessFallbackErrorTypeByStatus(res.statusCode);
        } else if (isRedirectError(err)) {
            errorType = 'redirect';
            res.statusCode = getRedirectStatusCodeFromError(err);
            const redirectUrl = addPathPrefix(getURLFromRedirectError(err), renderOpts.basePath);
            setHeader('location', redirectUrl);
        } else if (!shouldBailoutToCSR) {
            res.statusCode = 500;
        }
        const [errorPreinitScripts, errorBootstrapScript] = getRequiredScripts(renderOpts.buildManifest, ctx.assetPrefix, renderOpts.crossOrigin, renderOpts.subresourceIntegrityManifest, getAssetQueryString(ctx, false), ctx.nonce, '/_not-found/page');
        const prerenderLegacyStore = prerenderStore = {
            type: 'prerender-legacy',
            phase: 'render',
            rootParams,
            implicitTags: implicitTags,
            revalidate: typeof (prerenderStore == null ? void 0 : prerenderStore.revalidate) !== 'undefined' ? prerenderStore.revalidate : INFINITE_CACHE,
            expire: typeof (prerenderStore == null ? void 0 : prerenderStore.expire) !== 'undefined' ? prerenderStore.expire : INFINITE_CACHE,
            stale: typeof (prerenderStore == null ? void 0 : prerenderStore.stale) !== 'undefined' ? prerenderStore.stale : INFINITE_CACHE,
            tags: [
                ...(prerenderStore == null ? void 0 : prerenderStore.tags) || implicitTags
            ]
        };
        const errorRSCPayload = await workUnitAsyncStorage.run(prerenderLegacyStore, getErrorRSCPayload, tree, ctx, reactServerErrorsByDigest.has(err.digest) ? undefined : err, errorType);
        const errorServerStream = workUnitAsyncStorage.run(prerenderLegacyStore, ComponentMod.renderToReadableStream, errorRSCPayload, clientReferenceManifest.clientModules, {
            onError: serverComponentsErrorHandler
        });
        try {
            const fizzStream = await renderToInitialFizzStream({
                ReactDOMServer: require('react-dom/server.edge'),
                element: /*#__PURE__*/ _jsx(AppWithoutContext, {
                    reactServerStream: errorServerStream,
                    preinitScripts: errorPreinitScripts,
                    clientReferenceManifest: clientReferenceManifest,
                    nonce: ctx.nonce
                }),
                streamOptions: {
                    nonce: ctx.nonce,
                    // Include hydration scripts in the HTML
                    bootstrapScripts: [
                        errorBootstrapScript
                    ],
                    formState
                }
            });
            if (shouldGenerateStaticFlightData(workStore)) {
                const flightData = await streamToBuffer(reactServerPrerenderResult.asStream());
                metadata.flightData = flightData;
                metadata.segmentData = await collectSegmentData(flightData, prerenderLegacyStore, ComponentMod, renderOpts, fallbackRouteParams);
            }
            const validateRootLayout = renderOpts.dev;
            // This is intentionally using the readable datastream from the main
            // render rather than the flight data from the error page render
            const flightStream = reactServerPrerenderResult instanceof ServerPrerenderStreamResult ? reactServerPrerenderResult.asStream() : reactServerPrerenderResult.consumeAsStream();
            return {
                // Returning the error that was thrown so it can be used to handle
                // the response in the caller.
                digestErrorsMap: reactServerErrorsByDigest,
                ssrErrors: allCapturedErrors,
                stream: await continueFizzStream(fizzStream, {
                    inlinedDataStream: createInlinedDataReadableStream(flightStream, ctx.nonce, formState),
                    isStaticGeneration: true,
                    getServerInsertedHTML: makeGetServerInsertedHTML({
                        polyfills,
                        renderServerInsertedHTML,
                        serverCapturedErrors: [],
                        basePath: renderOpts.basePath,
                        tracingMetadata: tracingMetadata
                    }),
                    getServerInsertedMetadata,
                    validateRootLayout
                }),
                dynamicAccess: null,
                collectedRevalidate: prerenderStore !== null ? prerenderStore.revalidate : INFINITE_CACHE,
                collectedExpire: prerenderStore !== null ? prerenderStore.expire : INFINITE_CACHE,
                collectedStale: prerenderStore !== null ? prerenderStore.stale : INFINITE_CACHE,
                collectedTags: prerenderStore !== null ? prerenderStore.tags : null
            };
        } catch (finalErr) {
            if (process.env.NODE_ENV === 'development' && isHTTPAccessFallbackError(finalErr)) {
                const { bailOnRootNotFound } = require('../../client/components/dev-root-http-access-fallback-boundary');
                bailOnRootNotFound();
            }
            throw finalErr;
        }
    }
}
const loadingChunks = new Set();
const chunkListeners = [];
function trackChunkLoading(load) {
    loadingChunks.add(load);
    load.finally(()=>{
        if (loadingChunks.has(load)) {
            loadingChunks.delete(load);
            if (loadingChunks.size === 0) {
                // We are not currently loading any chunks. We can notify all listeners
                for(let i = 0; i < chunkListeners.length; i++){
                    chunkListeners[i]();
                }
                chunkListeners.length = 0;
            }
        }
    });
}
export async function warmFlightResponse(flightStream, clientReferenceManifest) {
    let createFromReadableStream;
    if (process.env.TURBOPACK) {
        createFromReadableStream = // eslint-disable-next-line import/no-extraneous-dependencies
        require('react-server-dom-turbopack/client.edge').createFromReadableStream;
    } else {
        createFromReadableStream = // eslint-disable-next-line import/no-extraneous-dependencies
        require('react-server-dom-webpack/client.edge').createFromReadableStream;
    }
    try {
        createFromReadableStream(flightStream, {
            serverConsumerManifest: {
                moduleLoading: clientReferenceManifest.moduleLoading,
                moduleMap: clientReferenceManifest.ssrModuleMapping,
                serverModuleMap: null
            }
        });
    } catch  {
    // We don't want to handle errors here but we don't want it to
    // interrupt the outer flow. We simply ignore it here and expect
    // it will bubble up during a render
    }
    // We'll wait at least one task and then if no chunks have started to load
    // we'll we can infer that there are none to load from this flight response
    trackChunkLoading(waitAtLeastOneReactRenderTask());
    return new Promise((r)=>{
        chunkListeners.push(r);
    });
}
const getGlobalErrorStyles = async (tree, ctx)=>{
    const { modules: { 'global-error': globalErrorModule } } = parseLoaderTree(tree);
    let globalErrorStyles;
    if (globalErrorModule) {
        const [, styles] = await createComponentStylesAndScripts({
            ctx,
            filePath: globalErrorModule[1],
            getComponent: globalErrorModule[0],
            injectedCSS: new Set(),
            injectedJS: new Set()
        });
        globalErrorStyles = styles;
    }
    return globalErrorStyles;
};
async function collectSegmentData(fullPageDataBuffer, prerenderStore, ComponentMod, renderOpts, fallbackRouteParams) {
    // Per-segment prefetch data
    //
    // All of the segments for a page are generated simultaneously, including
    // during revalidations. This is to ensure consistency, because it's
    // possible for a mismatch between a layout and page segment can cause the
    // client to error during rendering. We want to preserve the ability of the
    // client to recover from such a mismatch by re-requesting all the segments
    // to get a consistent view of the page.
    //
    // For performance, we reuse the Flight output that was created when
    // generating the initial page HTML. The Flight stream for the whole page is
    // decomposed into a separate stream per segment.
    const clientReferenceManifest = renderOpts.clientReferenceManifest;
    if (!clientReferenceManifest || !renderOpts.experimental.clientSegmentCache) {
        return;
    }
    // Manifest passed to the Flight client for reading the full-page Flight
    // stream. Based off similar code in use-cache-wrapper.ts.
    const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge';
    const serverConsumerManifest = {
        // moduleLoading must be null because we don't want to trigger preloads of ClientReferences
        // to be added to the consumer. Instead, we'll wait for any ClientReference to be emitted
        // which themselves will handle the preloading.
        moduleLoading: null,
        moduleMap: isEdgeRuntime ? clientReferenceManifest.edgeRscModuleMapping : clientReferenceManifest.rscModuleMapping,
        serverModuleMap: null
    };
    // When dynamicIO is enabled, missing data is encoded to an infinitely hanging
    // promise, the absence of which we use to determine if a segment is fully
    // static or partially static. However, when dynamicIO is not enabled, this
    // trick doesn't work.
    //
    // So if PPR is enabled, and dynamicIO is not, we have to be conservative and
    // assume all segments are partial.
    //
    // TODO: When PPR is on, we can at least optimize the case where the entire
    // page is static. Either by passing that as an argument to this function, or
    // by setting a header on the response like the we do for full page RSC
    // prefetches today. The latter approach might be simpler since it requires
    // less plumbing, and the client has to check the header regardless to see if
    // PPR is enabled.
    const shouldAssumePartialData = renderOpts.experimental.isRoutePPREnabled === true && // PPR is enabled
    !renderOpts.experimental.dynamicIO // dynamicIO is disabled
    ;
    const staleTime = prerenderStore.stale;
    return await ComponentMod.collectSegmentData(shouldAssumePartialData, fullPageDataBuffer, staleTime, clientReferenceManifest.clientModules, serverConsumerManifest, fallbackRouteParams);
}

//# sourceMappingURL=app-render.js.map