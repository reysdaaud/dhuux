// TODO: Remove use of `any` type. Fix no-use-before-define violations.
/* eslint-disable @typescript-eslint/no-use-before-define */ /**
 * MIT License
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */ // This file is a modified version of the Create React App HMR dev client that
// can be found here:
// https://github.com/facebook/create-react-app/blob/v3.4.1/packages/react-dev-utils/webpackHotDevClient.js
import { register, onBuildError, onBuildOk, onBeforeRefresh, onRefresh, onVersionInfo, onStaticIndicator, onDevIndicator } from './client';
import stripAnsi from 'next/dist/compiled/strip-ansi';
import { addMessageListener, sendMessage } from './websocket';
import formatWebpackMessages from '../utils/format-webpack-messages';
import { HMR_ACTIONS_SENT_TO_BROWSER } from '../../../../server/dev/hot-reloader-types';
import { extractModulesFromTurbopackMessage } from '../../../../server/dev/extract-modules-from-turbopack-message';
import { REACT_REFRESH_FULL_RELOAD_FROM_ERROR } from '../shared';
import { RuntimeErrorHandler } from '../../errors/runtime-error-handler';
window.__nextDevClientId = Math.round(Math.random() * 100 + Date.now());
let customHmrEventHandler;
let turbopackMessageListeners = [];
let MODE = 'webpack';
export default function connect(mode) {
    MODE = mode;
    register();
    addMessageListener((payload)=>{
        if (!('action' in payload)) {
            return;
        }
        try {
            processMessage(payload);
        } catch (err) {
            var _err_stack;
            console.warn('[HMR] Invalid message: ' + JSON.stringify(payload) + '\n' + ((_err_stack = err == null ? void 0 : err.stack) != null ? _err_stack : ''));
        }
    });
    return {
        subscribeToHmrEvent (handler) {
            customHmrEventHandler = handler;
        },
        onUnrecoverableError () {
            RuntimeErrorHandler.hadRuntimeError = true;
        },
        addTurbopackMessageListener (cb) {
            turbopackMessageListeners.push(cb);
        },
        sendTurbopackMessage (msg) {
            sendMessage(msg);
        },
        handleUpdateError (err) {
            performFullReload(err);
        }
    };
}
// Remember some state related to hot module replacement.
var isFirstCompilation = true;
var mostRecentCompilationHash = null;
var hasCompileErrors = false;
function clearOutdatedErrors() {
    // Clean up outdated compile errors, if any.
    if (typeof console !== 'undefined' && typeof console.clear === 'function') {
        if (hasCompileErrors) {
            console.clear();
        }
    }
}
// Successful compilation.
function handleSuccess() {
    clearOutdatedErrors();
    if (MODE === 'webpack') {
        const isHotUpdate = !isFirstCompilation || window.__NEXT_DATA__.page !== '/_error' && isUpdateAvailable();
        isFirstCompilation = false;
        hasCompileErrors = false;
        // Attempt to apply hot updates or reload.
        if (isHotUpdate) {
            tryApplyUpdates(onBeforeFastRefresh, onFastRefresh);
        }
    } else {
        reportHmrLatency([
            ...turbopackUpdatedModules
        ]);
        onBuildOk();
    }
}
// Compilation with warnings (e.g. ESLint).
function handleWarnings(warnings) {
    clearOutdatedErrors();
    const isHotUpdate = !isFirstCompilation;
    isFirstCompilation = false;
    hasCompileErrors = false;
    function printWarnings() {
        // Print warnings to the console.
        const formatted = formatWebpackMessages({
            warnings: warnings,
            errors: []
        });
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
            var _formatted_warnings;
            for(let i = 0; i < ((_formatted_warnings = formatted.warnings) == null ? void 0 : _formatted_warnings.length); i++){
                if (i === 5) {
                    console.warn('There were more warnings in other files.\n' + 'You can find a complete log in the terminal.');
                    break;
                }
                console.warn(stripAnsi(formatted.warnings[i]));
            }
        }
    }
    printWarnings();
    // Attempt to apply hot updates or reload.
    if (isHotUpdate) {
        tryApplyUpdates(onBeforeFastRefresh, onFastRefresh);
    }
}
// Compilation with errors (e.g. syntax error or missing modules).
function handleErrors(errors) {
    clearOutdatedErrors();
    isFirstCompilation = false;
    hasCompileErrors = true;
    // "Massage" webpack messages.
    var formatted = formatWebpackMessages({
        errors: errors,
        warnings: []
    });
    // Only show the first error.
    onBuildError(formatted.errors[0]);
    // Also log them to the console.
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
        for(var i = 0; i < formatted.errors.length; i++){
            console.error(stripAnsi(formatted.errors[i]));
        }
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
let startLatency = null;
let turbopackLastUpdateLatency = null;
let turbopackUpdatedModules = new Set();
let isrManifest = {};
function onBeforeFastRefresh(updatedModules) {
    if (updatedModules.length > 0) {
        // Only trigger a pending state if we have updates to apply
        // (cf. onFastRefresh)
        onBeforeRefresh();
    }
}
function onFastRefresh(updatedModules) {
    if (updatedModules === void 0) updatedModules = [];
    onBuildOk();
    if (updatedModules.length === 0) {
        return;
    }
    onRefresh();
    reportHmrLatency();
}
function reportHmrLatency(updatedModules) {
    if (updatedModules === void 0) updatedModules = [];
    if (!startLatency) return;
    // turbopack has a debounce for the BUILT event which we don't want to
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
    if (self.__NEXT_HMR_LATENCY_CB) {
        self.__NEXT_HMR_LATENCY_CB(latency);
    }
}
// There is a newer version of the code available.
function handleAvailableHash(hash) {
    // Update last known compilation hash.
    mostRecentCompilationHash = hash;
}
export function handleStaticIndicator() {
    if (process.env.__NEXT_DEV_INDICATOR) {
        var _window_next_router_components__app;
        const routeInfo = window.next.router.components[window.next.router.pathname];
        const pageComponent = routeInfo == null ? void 0 : routeInfo.Component;
        const appComponent = (_window_next_router_components__app = window.next.router.components['/_app']) == null ? void 0 : _window_next_router_components__app.Component;
        const isDynamicPage = Boolean(pageComponent == null ? void 0 : pageComponent.getInitialProps) || Boolean(routeInfo.__N_SSP);
        const hasAppGetInitialProps = Boolean(appComponent == null ? void 0 : appComponent.getInitialProps) && (appComponent == null ? void 0 : appComponent.getInitialProps) !== (appComponent == null ? void 0 : appComponent.origGetInitialProps);
        const isPageStatic = window.location.pathname in isrManifest || !isDynamicPage && !hasAppGetInitialProps;
        onStaticIndicator(isPageStatic);
    }
}
/** Handles messages from the sevrer for the Pages Router. */ function processMessage(obj) {
    if (!('action' in obj)) {
        return;
    }
    // Use turbopack message for analytics, (still need built for webpack)
    switch(obj.action){
        case HMR_ACTIONS_SENT_TO_BROWSER.ISR_MANIFEST:
            {
                isrManifest = obj.data;
                handleStaticIndicator();
                break;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.BUILDING:
            {
                startLatency = Date.now();
                turbopackLastUpdateLatency = null;
                turbopackUpdatedModules.clear();
                console.log('[Fast Refresh] rebuilding');
                break;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.BUILT:
        case HMR_ACTIONS_SENT_TO_BROWSER.SYNC:
            {
                if (obj.hash) handleAvailableHash(obj.hash);
                const { errors, warnings } = obj;
                // Is undefined when it's a 'built' event
                if ('versionInfo' in obj) onVersionInfo(obj.versionInfo);
                if ('devIndicator' in obj) onDevIndicator(obj.devIndicator);
                const hasErrors = Boolean(errors && errors.length);
                if (hasErrors) {
                    sendMessage(JSON.stringify({
                        event: 'client-error',
                        errorCount: errors.length,
                        clientId: window.__nextDevClientId
                    }));
                    return handleErrors(errors);
                }
                const hasWarnings = Boolean(warnings && warnings.length);
                if (hasWarnings) {
                    sendMessage(JSON.stringify({
                        event: 'client-warning',
                        warningCount: warnings.length,
                        clientId: window.__nextDevClientId
                    }));
                    return handleWarnings(warnings);
                }
                sendMessage(JSON.stringify({
                    event: 'client-success',
                    clientId: window.__nextDevClientId
                }));
                return handleSuccess();
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.SERVER_COMPONENT_CHANGES:
            {
                if (hasCompileErrors || RuntimeErrorHandler.hadRuntimeError) {
                    window.location.reload();
                }
                return;
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
        case HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_CONNECTED:
            {
                for (const listener of turbopackMessageListeners){
                    listener({
                        type: HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_CONNECTED,
                        data: obj.data
                    });
                }
                break;
            }
        case HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_MESSAGE:
            {
                const updatedModules = extractModulesFromTurbopackMessage(obj.data);
                onBeforeFastRefresh([
                    ...updatedModules
                ]);
                for (const listener of turbopackMessageListeners){
                    listener({
                        type: HMR_ACTIONS_SENT_TO_BROWSER.TURBOPACK_MESSAGE,
                        data: obj.data
                    });
                }
                if (RuntimeErrorHandler.hadRuntimeError) {
                    console.warn(REACT_REFRESH_FULL_RELOAD_FROM_ERROR);
                    performFullReload(null);
                }
                onRefresh();
                for (const module1 of updatedModules){
                    turbopackUpdatedModules.add(module1);
                }
                turbopackLastUpdateLatency = Date.now();
                break;
            }
        default:
            {
                if (customHmrEventHandler) {
                    customHmrEventHandler(obj);
                    break;
                }
                break;
            }
    }
}
// Is there a newer version of this code available?
function isUpdateAvailable() {
    /* globals __webpack_hash__ */ // __webpack_hash__ is the hash of the current compilation.
    // It's a global variable injected by Webpack.
    return mostRecentCompilationHash !== __webpack_hash__;
}
// Webpack disallows updates in other states.
function canApplyUpdates() {
    // @ts-expect-error TODO: module.hot exists but type needs to be added. Can't use `as any` here as webpack parses for `module.hot` calls.
    return module.hot.status() === 'idle';
}
function afterApplyUpdates(fn) {
    if (canApplyUpdates()) {
        fn();
    } else {
        function handler(status) {
            if (status === 'idle') {
                // @ts-expect-error TODO: module.hot exists but type needs to be added. Can't use `as any` here as webpack parses for `module.hot` calls.
                module.hot.removeStatusHandler(handler);
                fn();
            }
        }
        // @ts-expect-error TODO: module.hot exists but type needs to be added. Can't use `as any` here as webpack parses for `module.hot` calls.
        module.hot.addStatusHandler(handler);
    }
}
// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onBeforeHotUpdate, onHotUpdateSuccess) {
    // @ts-expect-error TODO: module.hot exists but type needs to be added. Can't use `as any` here as webpack parses for `module.hot` calls.
    if (!module.hot) {
        // HotModuleReplacementPlugin is not in Webpack configuration.
        console.error('HotModuleReplacementPlugin is not in Webpack configuration.');
        // window.location.reload();
        return;
    }
    if (!isUpdateAvailable() || !canApplyUpdates()) {
        onBuildOk();
        return;
    }
    function handleApplyUpdates(err, updatedModules) {
        if (err || RuntimeErrorHandler.hadRuntimeError || !updatedModules) {
            if (err) {
                console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
            } else if (RuntimeErrorHandler.hadRuntimeError) {
                console.warn('[Fast Refresh] performing full reload because your application had an unrecoverable error');
            }
            performFullReload(err);
            return;
        }
        if (typeof onHotUpdateSuccess === 'function') {
            // Maybe we want to do something.
            onHotUpdateSuccess(updatedModules);
        }
        if (isUpdateAvailable()) {
            // While we were updating, there was a new update! Do it again.
            // However, this time, don't trigger a pending refresh state.
            tryApplyUpdates(updatedModules.length > 0 ? undefined : onBeforeHotUpdate, updatedModules.length > 0 ? onBuildOk : onHotUpdateSuccess);
        } else {
            onBuildOk();
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
    // @ts-expect-error TODO: module.hot exists but type needs to be added. Can't use `as any` here as webpack parses for `module.hot` calls.
    module.hot.check(/* autoApply */ false).then((updatedModules)=>{
        if (!updatedModules) {
            return null;
        }
        if (typeof onBeforeHotUpdate === 'function') {
            onBeforeHotUpdate(updatedModules);
        }
        // @ts-expect-error TODO: module.hot exists but type needs to be added. Can't use `as any` here as webpack parses for `module.hot` calls.
        return module.hot.apply();
    }).then((updatedModules)=>{
        handleApplyUpdates(null, updatedModules);
    }, (err)=>{
        handleApplyUpdates(err, null);
    });
}
export function performFullReload(err) {
    const stackTrace = err && (err.stack && err.stack.split('\n').slice(0, 5).join('\n') || err.message || err + '');
    sendMessage(JSON.stringify({
        event: 'client-full-reload',
        stackTrace,
        hadRuntimeError: !!RuntimeErrorHandler.hadRuntimeError,
        dependencyChain: err ? err.dependencyChain : undefined
    }));
    window.location.reload();
}

//# sourceMappingURL=hot-reloader-client.js.map