import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, startTransition, useMemo, useRef, useSyncExternalStore } from 'react';
import stripAnsi from 'next/dist/compiled/strip-ansi';
import formatWebpackMessages from '../utils/format-webpack-messages';
import { useRouter } from '../../navigation';
import { ACTION_BEFORE_REFRESH, ACTION_BUILD_ERROR, ACTION_BUILD_OK, ACTION_DEBUG_INFO, ACTION_DEV_INDICATOR, ACTION_REFRESH, ACTION_STATIC_INDICATOR, ACTION_UNHANDLED_ERROR, ACTION_UNHANDLED_REJECTION, ACTION_VERSION_INFO, useErrorOverlayReducer } from '../shared';
import { parseStack } from '../utils/parse-stack';
import { AppDevOverlay } from './app-dev-overlay';
import { useErrorHandler } from '../../errors/use-error-handler';
import { RuntimeErrorHandler } from '../../errors/runtime-error-handler';
import { useSendMessage, useTurbopack, useWebsocket, useWebsocketPing } from '../utils/use-websocket';
import { parseComponentStack } from '../utils/parse-component-stack';
import { HMR_ACTIONS_SENT_TO_BROWSER } from '../../../../server/dev/hot-reloader-types';
import { extractModulesFromTurbopackMessage } from '../../../../server/dev/extract-modules-from-turbopack-message';
import { REACT_REFRESH_FULL_RELOAD_FROM_ERROR } from '../shared';
import { useUntrackedPathname } from '../../navigation-untracked';
import { getReactStitchedError } from '../../errors/stitched-error';
import { shouldRenderRootLevelErrorOverlay } from '../../../lib/is-error-thrown-while-rendering-rsc';
import { handleDevBuildIndicatorHmrEvents } from '../../../dev/dev-build-indicator/internal/handle-dev-build-indicator-hmr-events';
let mostRecentCompilationHash = null;
let __nextDevClientId = Math.round(Math.random() * 100 + Date.now());
let reloading = false;
let startLatency = null;
let turbopackLastUpdateLatency = null;
let turbopackUpdatedModules = new Set();
let pendingHotUpdateWebpack = Promise.resolve();
let resolvePendingHotUpdateWebpack = ()=>{};
function setPendingHotUpdateWebpack() {
    pendingHotUpdateWebpack = new Promise((resolve)=>{
        resolvePendingHotUpdateWebpack = ()=>{
            resolve();
        };
    });
}
export function waitForWebpackRuntimeHotUpdate() {
    return pendingHotUpdateWebpack;
}
function handleBeforeHotUpdateWebpack(dispatcher, hasUpdates) {
    if (hasUpdates) {
        dispatcher.onBeforeRefresh();
    }
}
function handleSuccessfulHotUpdateWebpack(dispatcher, sendMessage, updatedModules) {
    resolvePendingHotUpdateWebpack();
    dispatcher.onBuildOk();
    reportHmrLatency(sendMessage, updatedModules);
    dispatcher.onRefresh();
}
function reportHmrLatency(sendMessage, updatedModules) {
    if (!startLatency) return;
    // turbopack has a debounce for the "built" event which we don't want to
    // incorrectly show in this number, use the last TURBOPACK_MESSAGE time
    let endLatency = turbopackLastUpdateLatency != null ? turbopackLastUpdateLatency : Date.now();
    const latency = endLatency - startLatency;
    console.log("[Fast Refresh] done in " + latency + "ms");
    sendMessage(JSON.stringify({
        event: 'client-hmr-latency',
        id: window.__nextDevClientId,
        startTime: startLatency,
        endTime: endLatency,
        page: window.location.pathname,
        updatedModules,
        // Whether the page (tab) was hidden at the time the event occurred.
        // This can impact the accuracy of the event's timing.
        isPageHidden: document.visibilityState === 'hidden'
    }));
}
// There is a newer version of the code available.
function handleAvailableHash(hash) {
    // Update last known compilation hash.
    mostRecentCompilationHash = hash;
}
/**
 * Is there a newer version of this code available?
 * For webpack: Check if the hash changed compared to __webpack_hash__
 * For Turbopack: Always true because it doesn't have __webpack_hash__
 */ function isUpdateAvailable() {
    if (process.env.TURBOPACK) {
        return true;
    }
    /* globals __webpack_hash__ */ // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    return mostRecentCompilationHash !== __webpack_hash__;
}
// Webpack disallows updates in other states.
function canApplyUpdates() {
    // @ts-expect-error module.hot exists
    return module.hot.status() === 'idle';
}
function afterApplyUpdates(fn) {
    if (canApplyUpdates()) {
        fn();
    } else {
        function handler(status) {
            if (status === 'idle') {
                // @ts-expect-error module.hot exists
                module.hot.removeStatusHandler(handler);
                fn();
            }
        }
        // @ts-expect-error module.hot exists
        module.hot.addStatusHandler(handler);
    }
}
function performFullReload(err, sendMessage) {
    const stackTrace = err && (err.stack && err.stack.split('\n').slice(0, 5).join('\n') || err.message || err + '');
    sendMessage(JSON.stringify({
        event: 'client-full-reload',
        stackTrace,
        hadRuntimeError: !!RuntimeErrorHandler.hadRuntimeError,
        dependencyChain: err ? err.dependencyChain : undefined
    }));
    if (reloading) return;
    reloading = true;
    window.location.reload();
}
// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onBeforeUpdate, onHotUpdateSuccess, sendMessage, dispatcher) {
    if (!isUpdateAvailable() || !canApplyUpdates()) {
        resolvePendingHotUpdateWebpack();
        dispatcher.onBuildOk();
        reportHmrLatency(sendMessage, []);
        return;
    }
    function handleApplyUpdates(err, updatedModules) {
        if (err || RuntimeErrorHandler.hadRuntimeError || !updatedModules) {
            if (err) {
                console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
            } else if (RuntimeErrorHandler.hadRuntimeError) {
                console.warn(REACT_REFRESH_FULL_RELOAD_FROM_ERROR);
            }
            performFullReload(err, sendMessage);
            return;
        }
        const hasUpdates = Boolean(updatedModules.length);
        if (typeof onHotUpdateSuccess === 'function') {
            // Maybe we want to do something.
            onHotUpdateSuccess(updatedModules);
        }
        if (isUpdateAvailable()) {
            // While we were updating, there was a new update! Do it again.
            tryApplyUpdates(hasUpdates ? ()=>{} : onBeforeUpdate, hasUpdates ? ()=>dispatcher.onBuildOk() : onHotUpdateSuccess, sendMessage, dispatcher);
        } else {
            dispatcher.onBuildOk();
            if (process.env.__NEXT_TEST_MODE) {
                afterApplyUpdates(()=>{
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                });
            }
        }
    }
    // https://webpack.js.org/api/hot-module-replacement/#check
    // @ts-expect-error module.hot exists
    module.hot.check(/* autoApply */ false).then((updatedModules)=>{
        if (!updatedModules) {
            return null;
        }
        if (typeof onBeforeUpdate === 'function') {
            const hasUpdates = Boolean(updatedModules.length);
            onBeforeUpdate(hasUpdates);
        }
        // https://webpack.js.org/api/hot-module-replacement/#apply
        // @ts-expect-error module.hot exists
        return module.hot.apply();
    }).then((updatedModules)=>{
        handleApplyUpdates(null, updatedModules);
    }, (err)=>{
        handleApplyUpdates(err, null);
    });
}
/** Handles messages from the sevrer for the App Router. */ function processMessage(obj, sendMessage, processTurbopackMessage, router, dispatcher, appIsrManifestRef, pathnameRef) {
    if (!('action' in obj)) {
        return;
    }
    function handleErrors(errors) {
        // "Massage" webpack messages.
        const formatted = formatWebpackMessages({
            errors: errors,
            warnings: []
        });
        // Only show the first error.
        dispatcher.onBuildError(formatted.errors[0]);
        // Also log them to the console.
        for(let i = 0; i < formatted.errors.length; i++){
            console.error(stripAnsi(formatted.errors[i]));
        }
        // Do not attempt to reload now.
        // We will reload on next success instead.
        if (process.env.__NEXT_TEST_MODE) {
            if (self.__NEXT_HMR_CB) {
                self.__NEXT_HMR_CB(formatted.errors[0]);
                self.__NEXT_HMR_CB = null;
            }
        }
    }
    function handleHotUpdate() {
        if (process.env.TURBOPACK) {
            dispatcher.onBuildOk();
            reportHmrLatency(sendMessage, [
                ...turbopackUpdatedModules
            ]);
        } else {
            tryApplyUpdates(function onBeforeHotUpdate(hasUpdates) {
                handleBeforeHotUpdateWebpack(dispatcher, hasUpdates);
            }, function onSuccessfulHotUpdate(webpackUpdatedModules) {
                // Only dismiss it when we're sure it's a hot update.
                // Otherwise it would flicker right before the reload.
                handleSuccessfulHotUpdateWebpack(dispatcher, sendMessage, webpackUpdatedModules);
            }, sendMessage, dispatcher);
        }
    }
    switch(obj.action){
        case HMR_ACTIONS_SENT_TO_BROWSER.ISR_MANIFEST:
            {
                if (process.env.__NEXT_DEV_INDICATOR) {
                    if (appIsrManifestRef) {
                        appIsrManifestRef.current = obj.data;
                        // handle initial status on receiving manifest
                        // navigation is handled in useEffect for pathname changes
                        // as we'll receive the updated manifest before usePathname
                        // triggers for new value
                        if (pathnameRef.current in obj.data) {
                            dispatcher.onStaticIndicator(true);
                        } else {
                            dispatcher.onStaticIndicator(false);
                        }
                    }
                }
                break;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.BUILDING:
            {
                startLatency = Date.now();
                turbopackLastUpdateLatency = null;
                turbopackUpdatedModules.clear();
                if (!process.env.TURBOPACK) {
                    setPendingHotUpdateWebpack();
                }
                console.log('[Fast Refresh] rebuilding');
                break;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.BUILT:
        case HMR_ACTIONS_SENT_TO_BROWSER.SYNC:
            {
                if (obj.hash) {
                    handleAvailableHash(obj.hash);
                }
                const { errors, warnings } = obj;
                // Is undefined when it's a 'built' event
                if ('versionInfo' in obj) dispatcher.onVersionInfo(obj.versionInfo);
                if ('debug' in obj && obj.debug) dispatcher.onDebugInfo(obj.debug);
                if ('devIndicator' in obj) dispatcher.onDevIndicator(obj.devIndicator);
                const hasErrors = Boolean(errors && errors.length);
                // Compilation with errors (e.g. syntax error or missing modules).
                if (hasErrors) {
                    sendMessage(JSON.stringify({
                        event: 'client-error',
                        errorCount: errors.length,
                        clientId: __nextDevClientId
                    }));
                    handleErrors(errors);
                    return;
                }
                const hasWarnings = Boolean(warnings && warnings.length);
                if (hasWarnings) {
                    sendMessage(JSON.stringify({
                        event: 'client-warning',
                        warningCount: warnings.length,
                        clientId: __nextDevClientId
                    }));
                    // Print warnings to the console.
                    const formattedMessages = formatWebpackMessages({
                        warnings: warnings,
                        errors: []
                    });
                    for(let i = 0; i < formattedMessages.warnings.length; i++){
                        if (i === 5) {
                            console.warn('There were more warnings in other files.\n' + 'You can find a complete log in the terminal.');
                            break;
                        }
                        console.warn(stripAnsi(formattedMessages.warnings[i]));
                    }
                // No early return here as we need to apply modules in the same way between warnings only and compiles without warnings
                }
                sendMessage(JSON.stringify({
                    event: 'client-success',
                    clientId: __nextDevClientId
                }));
                if (obj.action === HMR_ACTIONS_SENT_TO_BROWSER.BUILT) {
                    // Handle hot updates
                    handleHotUpdate();
                }
                return;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_CONNECTED:
            {
                processTurbopackMessage({
                    type: HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_CONNECTED,
                    data: {
                        sessionId: obj.data.sessionId
                    }
                });
                break;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_MESSAGE:
            {
                dispatcher.onBeforeRefresh();
                processTurbopackMessage({
                    type: HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_MESSAGE,
                    data: obj.data
                });
                dispatcher.onRefresh();
                if (RuntimeErrorHandler.hadRuntimeError) {
                    console.warn(REACT_REFRESH_FULL_RELOAD_FROM_ERROR);
                    performFullReload(null, sendMessage);
                }
                for (const module1 of extractModulesFromTurbopackMessage(obj.data)){
                    turbopackUpdatedModules.add(module1);
                }
                turbopackLastUpdateLatency = Date.now();
                break;
            }
        // TODO-APP: make server component change more granular
        case HMR_ACTIONS_SENT_TO_BROWSER.SERVER_COMPONENT_CHANGES:
            {
                sendMessage(JSON.stringify({
                    event: 'server-component-reload-page',
                    clientId: __nextDevClientId,
                    hash: obj.hash
                }));
                // Store the latest hash in a session cookie so that it's sent back to the
                // server with any subsequent requests.
                document.cookie = "__next_hmr_refresh_hash__=" + obj.hash;
                if (RuntimeErrorHandler.hadRuntimeError) {
                    if (reloading) return;
                    reloading = true;
                    return window.location.reload();
                }
                startTransition(()=>{
                    router.hmrRefresh();
                    dispatcher.onRefresh();
                });
                if (process.env.__NEXT_TEST_MODE) {
                    if (self.__NEXT_HMR_CB) {
                        self.__NEXT_HMR_CB();
                        self.__NEXT_HMR_CB = null;
                    }
                }
                return;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.RELOAD_PAGE:
            {
                sendMessage(JSON.stringify({
                    event: 'client-reload-page',
                    clientId: __nextDevClientId
                }));
                if (reloading) return;
                reloading = true;
                return window.location.reload();
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.ADDED_PAGE:
        case HMR_ACTIONS_SENT_TO_BROWSER.REMOVED_PAGE:
            {
                // TODO-APP: potentially only refresh if the currently viewed page was added/removed.
                return router.hmrRefresh();
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.SERVER_ERROR:
            {
                const { errorJSON } = obj;
                if (errorJSON) {
                    const { message, stack } = JSON.parse(errorJSON);
                    const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                        value: "E394",
                        enumerable: false,
                        configurable: true
                    });
                    error.stack = stack;
                    handleErrors([
                        error
                    ]);
                }
                return;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.DEV_PAGES_MANIFEST_UPDATE:
            {
                return;
            }
        default:
            {}
    }
}
export default function HotReload(param) {
    let { assetPrefix, children, globalError } = param;
    const [state, dispatch] = useErrorOverlayReducer('app');
    const dispatcher = useMemo(()=>{
        return {
            onBuildOk () {
                dispatch({
                    type: ACTION_BUILD_OK
                });
            },
            onBuildError (message) {
                dispatch({
                    type: ACTION_BUILD_ERROR,
                    message
                });
            },
            onBeforeRefresh () {
                dispatch({
                    type: ACTION_BEFORE_REFRESH
                });
            },
            onRefresh () {
                dispatch({
                    type: ACTION_REFRESH
                });
            },
            onVersionInfo (versionInfo) {
                dispatch({
                    type: ACTION_VERSION_INFO,
                    versionInfo
                });
            },
            onStaticIndicator (status) {
                dispatch({
                    type: ACTION_STATIC_INDICATOR,
                    staticIndicator: status
                });
            },
            onDebugInfo (debugInfo) {
                dispatch({
                    type: ACTION_DEBUG_INFO,
                    debugInfo
                });
            },
            onDevIndicator (devIndicator) {
                dispatch({
                    type: ACTION_DEV_INDICATOR,
                    devIndicator
                });
            }
        };
    }, [
        dispatch
    ]);
    //  We render a separate error overlay at the root when an error is thrown from rendering RSC, so
    //  we should not render an additional error overlay in the descendent. However, we need to
    //  keep rendering these hooks to ensure HMR works when the error is addressed.
    const shouldRenderErrorOverlay = useSyncExternalStore(()=>()=>{}, ()=>!shouldRenderRootLevelErrorOverlay(), ()=>true);
    const handleOnUnhandledError = useCallback((error)=>{
        const errorDetails = error.details;
        // Component stack is added to the error in use-error-handler in case there was a hydration error
        const componentStackTrace = error._componentStack || (errorDetails == null ? void 0 : errorDetails.componentStack);
        const warning = errorDetails == null ? void 0 : errorDetails.warning;
        dispatch({
            type: ACTION_UNHANDLED_ERROR,
            reason: error,
            frames: parseStack(error.stack || ''),
            componentStackFrames: typeof componentStackTrace === 'string' ? parseComponentStack(componentStackTrace) : undefined,
            warning
        });
    }, [
        dispatch
    ]);
    const handleOnUnhandledRejection = useCallback((reason)=>{
        const stitchedError = getReactStitchedError(reason);
        dispatch({
            type: ACTION_UNHANDLED_REJECTION,
            reason: stitchedError,
            frames: parseStack(stitchedError.stack || '')
        });
    }, [
        dispatch
    ]);
    useErrorHandler(handleOnUnhandledError, handleOnUnhandledRejection);
    const webSocketRef = useWebsocket(assetPrefix);
    useWebsocketPing(webSocketRef);
    const sendMessage = useSendMessage(webSocketRef);
    const processTurbopackMessage = useTurbopack(sendMessage, (err)=>performFullReload(err, sendMessage));
    const router = useRouter();
    // We don't want access of the pathname for the dev tools to trigger a dynamic
    // access (as the dev overlay will never be present in production).
    const pathname = useUntrackedPathname();
    const appIsrManifestRef = useRef({});
    const pathnameRef = useRef(pathname);
    if (process.env.__NEXT_DEV_INDICATOR) {
        // this conditional is only for dead-code elimination which
        // isn't a runtime conditional only build-time so ignore hooks rule
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(()=>{
            pathnameRef.current = pathname;
            const appIsrManifest = appIsrManifestRef.current;
            if (appIsrManifest) {
                if (pathname && pathname in appIsrManifest) {
                    try {
                        dispatcher.onStaticIndicator(true);
                    } catch (reason) {
                        let message = '';
                        if (reason instanceof DOMException) {
                            var _reason_stack;
                            // Most likely a SecurityError, because of an unavailable localStorage
                            message = (_reason_stack = reason.stack) != null ? _reason_stack : reason.message;
                        } else if (reason instanceof Error) {
                            var _reason_stack1;
                            message = 'Error: ' + reason.message + '\n' + ((_reason_stack1 = reason.stack) != null ? _reason_stack1 : '');
                        } else {
                            message = 'Unexpected Exception: ' + reason;
                        }
                        console.warn('[HMR] ' + message);
                    }
                } else {
                    dispatcher.onStaticIndicator(false);
                }
            }
        }, [
            pathname,
            dispatcher
        ]);
    }
    useEffect(()=>{
        const websocket = webSocketRef.current;
        if (!websocket) return;
        const handler = (event)=>{
            try {
                const obj = JSON.parse(event.data);
                handleDevBuildIndicatorHmrEvents(obj);
                processMessage(obj, sendMessage, processTurbopackMessage, router, dispatcher, appIsrManifestRef, pathnameRef);
            } catch (err) {
                var _err_stack;
                console.warn('[HMR] Invalid message: ' + JSON.stringify(event.data) + '\n' + ((_err_stack = err == null ? void 0 : err.stack) != null ? _err_stack : ''));
            }
        };
        websocket.addEventListener('message', handler);
        return ()=>websocket.removeEventListener('message', handler);
    }, [
        sendMessage,
        router,
        webSocketRef,
        dispatcher,
        processTurbopackMessage,
        appIsrManifestRef
    ]);
    if (shouldRenderErrorOverlay) {
        return /*#__PURE__*/ _jsx(AppDevOverlay, {
            state: state,
            globalError: globalError,
            children: children
        });
    }
    return children;
}

//# sourceMappingURL=hot-reloader-client.js.map