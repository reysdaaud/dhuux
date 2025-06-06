"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAppStaticPaths", {
    enumerable: true,
    get: function() {
        return buildAppStaticPaths;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _runwithafter = require("../../server/after/run-with-after");
const _workstore = require("../../server/async-storage/work-store");
const _fallback = require("../../lib/fallback");
const _routematcher = require("../../shared/lib/router/utils/route-matcher");
const _routeregex = require("../../shared/lib/router/utils/route-regex");
const _utils = require("./utils");
const _escapepathdelimiters = /*#__PURE__*/ _interop_require_default(require("../../shared/lib/router/utils/escape-path-delimiters"));
const _createincrementalcache = require("../../export/helpers/create-incremental-cache");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * Compares two parameters to see if they're equal.
 *
 * @param a - The first parameter.
 * @param b - The second parameter.
 * @returns Whether the parameters are equal.
 */ function areParamValuesEqual(a, b) {
    // If they're equal, then we can return true.
    if (a === b) {
        return true;
    }
    // If they're both arrays, then we can return true if they have the same
    // length and all the items are the same.
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        return a.every((item, index)=>item === b[index]);
    }
    // Otherwise, they're not equal.
    return false;
}
/**
 * Filters out duplicate parameters from a list of parameters.
 *
 * @param routeParamKeys - The keys of the parameters.
 * @param routeParams - The list of parameters to filter.
 * @returns The list of unique parameters.
 */ function filterUniqueParams(routeParamKeys, routeParams) {
    const unique = [];
    for (const params of routeParams){
        let i = 0;
        for(; i < unique.length; i++){
            const item = unique[i];
            let j = 0;
            for(; j < routeParamKeys.length; j++){
                const key = routeParamKeys[j];
                // If the param is not the same, then we need to break out of the loop.
                if (!areParamValuesEqual(item[key], params[key])) {
                    break;
                }
            }
            // If we got to the end of the paramKeys array, then it means that we
            // found a duplicate. Skip it.
            if (j === routeParamKeys.length) {
                break;
            }
        }
        // If we didn't get to the end of the unique array, then it means that we
        // found a duplicate. Skip it.
        if (i < unique.length) {
            continue;
        }
        unique.push(params);
    }
    return unique;
}
/**
 * Filters out all combinations of root params from a list of parameters.
 *
 * Given the following root param ('lang'), and the following routeParams:
 *
 * ```
 * [
 *   { lang: 'en', region: 'US', slug: ['home'] },
 *   { lang: 'en', region: 'US', slug: ['about'] },
 *   { lang: 'fr', region: 'CA', slug: ['about'] },
 * ]
 * ```
 *
 * The result will be:
 *
 * ```
 * [
 *   { lang: 'en', region: 'US' },
 *   { lang: 'fr', region: 'CA' },
 * ]
 * ```
 *
 * @param rootParamKeys - The keys of the root params.
 * @param routeParams - The list of parameters to filter.
 * @returns The list of combinations of root params.
 */ function filterRootParamsCombinations(rootParamKeys, routeParams) {
    const combinations = [];
    for (const params of routeParams){
        const combination = {};
        // Collect all root params. As soon as we don't find a root param, break.
        let i = 0;
        for(; i < rootParamKeys.length; i++){
            const key = rootParamKeys[i];
            if (params[key]) {
                combination[key] = params[key];
            } else {
                break;
            }
        }
        // If we didn't find all root params, skip this combination. We only want to
        // generate combinations that have all root params.
        if (i < rootParamKeys.length) {
            continue;
        }
        combinations.push(combination);
    }
    return combinations;
}
/**
 * Validates the parameters to ensure they're accessible and have the correct
 * types.
 *
 * @param page - The page to validate.
 * @param regex - The route regex.
 * @param isRoutePPREnabled - Whether the route has partial prerendering enabled.
 * @param routeParamKeys - The keys of the parameters.
 * @param rootParamKeys - The keys of the root params.
 * @param routeParams - The list of parameters to validate.
 * @returns The list of validated parameters.
 */ function validateParams(page, regex, isRoutePPREnabled, routeParamKeys, rootParamKeys, routeParams) {
    const valid = [];
    // Validate that if there are any root params, that the user has provided at
    // least one value for them only if we're using partial prerendering.
    if (isRoutePPREnabled && rootParamKeys.length > 0) {
        if (routeParams.length === 0 || rootParamKeys.some((key)=>routeParams.some((params)=>!(key in params)))) {
            if (rootParamKeys.length === 1) {
                throw Object.defineProperty(new Error(`A required root parameter (${rootParamKeys[0]}) was not provided in generateStaticParams for ${page}, please provide at least one value.`), "__NEXT_ERROR_CODE", {
                    value: "E622",
                    enumerable: false,
                    configurable: true
                });
            }
            throw Object.defineProperty(new Error(`Required root params (${rootParamKeys.join(', ')}) were not provided in generateStaticParams for ${page}, please provide at least one value for each.`), "__NEXT_ERROR_CODE", {
                value: "E621",
                enumerable: false,
                configurable: true
            });
        }
    }
    for (const params of routeParams){
        const item = {};
        for (const key of routeParamKeys){
            const { repeat, optional } = regex.groups[key];
            let paramValue = params[key];
            if (optional && params.hasOwnProperty(key) && (paramValue === null || paramValue === undefined || paramValue === false)) {
                paramValue = [];
            }
            // A parameter is missing, so the rest of the params are not accessible.
            // We only support this when the route has partial prerendering enabled.
            // This will make it so that the remaining params are marked as missing so
            // we can generate a fallback route for them.
            if (!paramValue && isRoutePPREnabled) {
                break;
            }
            // Perform validation for the parameter based on whether it's a repeat
            // parameter or not.
            if (repeat) {
                if (!Array.isArray(paramValue)) {
                    throw Object.defineProperty(new Error(`A required parameter (${key}) was not provided as an array received ${typeof paramValue} in generateStaticParams for ${page}`), "__NEXT_ERROR_CODE", {
                        value: "E618",
                        enumerable: false,
                        configurable: true
                    });
                }
            } else {
                if (typeof paramValue !== 'string') {
                    throw Object.defineProperty(new Error(`A required parameter (${key}) was not provided as a string received ${typeof paramValue} in generateStaticParams for ${page}`), "__NEXT_ERROR_CODE", {
                        value: "E617",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            item[key] = paramValue;
        }
        valid.push(item);
    }
    return valid;
}
async function buildAppStaticPaths({ dir, page, distDir, dynamicIO, authInterrupts, segments, isrFlushToDisk, cacheHandler, cacheLifeProfiles, requestHeaders, cacheHandlers, maxMemoryCacheSize, fetchCacheKeyPrefix, nextConfigOutput, ComponentMod, isRoutePPREnabled = false, buildId, rootParamKeys }) {
    if (segments.some((generate)=>{
        var _generate_config;
        return ((_generate_config = generate.config) == null ? void 0 : _generate_config.dynamicParams) === true;
    }) && nextConfigOutput === 'export') {
        throw Object.defineProperty(new Error('"dynamicParams: true" cannot be used with "output: export". See more info here: https://nextjs.org/docs/app/building-your-application/deploying/static-exports'), "__NEXT_ERROR_CODE", {
            value: "E393",
            enumerable: false,
            configurable: true
        });
    }
    ComponentMod.patchFetch();
    const incrementalCache = await (0, _createincrementalcache.createIncrementalCache)({
        dir,
        distDir,
        cacheHandler,
        cacheHandlers,
        requestHeaders,
        fetchCacheKeyPrefix,
        flushToDisk: isrFlushToDisk,
        cacheMaxMemorySize: maxMemoryCacheSize
    });
    const regex = (0, _routeregex.getRouteRegex)(page);
    const routeParamKeys = Object.keys((0, _routematcher.getRouteMatcher)(regex)(page) || {});
    const afterRunner = new _runwithafter.AfterRunner();
    const store = (0, _workstore.createWorkStore)({
        page,
        // We're discovering the parameters here, so we don't have any unknown
        // ones.
        fallbackRouteParams: null,
        renderOpts: {
            incrementalCache,
            cacheLifeProfiles,
            supportsDynamicResponse: true,
            isRevalidate: false,
            experimental: {
                dynamicIO,
                authInterrupts
            },
            waitUntil: afterRunner.context.waitUntil,
            onClose: afterRunner.context.onClose,
            onAfterTaskError: afterRunner.context.onTaskError
        },
        buildId
    });
    const routeParams = await ComponentMod.workAsyncStorage.run(store, async ()=>{
        async function builtRouteParams(parentsParams = [], idx = 0) {
            // If we don't have any more to process, then we're done.
            if (idx === segments.length) return parentsParams;
            const current = segments[idx];
            if (typeof current.generateStaticParams !== 'function' && idx < segments.length) {
                return builtRouteParams(parentsParams, idx + 1);
            }
            const params = [];
            if (current.generateStaticParams) {
                var _current_config;
                // fetchCache can be used to inform the fetch() defaults used inside
                // of generateStaticParams. revalidate and dynamic options don't come into
                // play within generateStaticParams.
                if (typeof ((_current_config = current.config) == null ? void 0 : _current_config.fetchCache) !== 'undefined') {
                    store.fetchCache = current.config.fetchCache;
                }
                if (parentsParams.length > 0) {
                    for (const parentParams of parentsParams){
                        const result = await current.generateStaticParams({
                            params: parentParams
                        });
                        for (const item of result){
                            params.push({
                                ...parentParams,
                                ...item
                            });
                        }
                    }
                } else {
                    const result = await current.generateStaticParams({
                        params: {}
                    });
                    params.push(...result);
                }
            }
            if (idx < segments.length) {
                return builtRouteParams(params, idx + 1);
            }
            return params;
        }
        return builtRouteParams();
    });
    let lastDynamicSegmentHadGenerateStaticParams = false;
    for (const segment of segments){
        var _segment_config;
        // Check to see if there are any missing params for segments that have
        // dynamicParams set to false.
        if (segment.param && segment.isDynamicSegment && ((_segment_config = segment.config) == null ? void 0 : _segment_config.dynamicParams) === false) {
            for (const params of routeParams){
                if (segment.param in params) continue;
                const relative = segment.filePath ? _path.default.relative(dir, segment.filePath) : undefined;
                throw Object.defineProperty(new Error(`Segment "${relative}" exports "dynamicParams: false" but the param "${segment.param}" is missing from the generated route params.`), "__NEXT_ERROR_CODE", {
                    value: "E280",
                    enumerable: false,
                    configurable: true
                });
            }
        }
        if (segment.isDynamicSegment && typeof segment.generateStaticParams !== 'function') {
            lastDynamicSegmentHadGenerateStaticParams = false;
        } else if (typeof segment.generateStaticParams === 'function') {
            lastDynamicSegmentHadGenerateStaticParams = true;
        }
    }
    // Determine if all the segments have had their parameters provided.
    const hadAllParamsGenerated = routeParamKeys.length === 0 || routeParams.length > 0 && routeParams.every((params)=>{
        for (const key of routeParamKeys){
            if (key in params) continue;
            return false;
        }
        return true;
    });
    // TODO: dynamic params should be allowed to be granular per segment but
    // we need additional information stored/leveraged in the prerender
    // manifest to allow this behavior.
    const dynamicParams = segments.every((segment)=>{
        var _segment_config;
        return ((_segment_config = segment.config) == null ? void 0 : _segment_config.dynamicParams) !== false;
    });
    const supportsRoutePreGeneration = hadAllParamsGenerated || process.env.NODE_ENV === 'production';
    const fallbackMode = dynamicParams ? supportsRoutePreGeneration ? isRoutePPREnabled ? _fallback.FallbackMode.PRERENDER : _fallback.FallbackMode.BLOCKING_STATIC_RENDER : undefined : _fallback.FallbackMode.NOT_FOUND;
    const result = {
        fallbackMode,
        prerenderedRoutes: lastDynamicSegmentHadGenerateStaticParams ? [] : undefined
    };
    if (hadAllParamsGenerated || isRoutePPREnabled) {
        if (isRoutePPREnabled) {
            // Discover all unique combinations of the rootParams so we can generate
            // shells for each of them if they're available.
            routeParams.unshift(...filterRootParamsCombinations(rootParamKeys, routeParams));
            result.prerenderedRoutes ??= [];
            result.prerenderedRoutes.push({
                pathname: page,
                encodedPathname: page,
                fallbackRouteParams: routeParamKeys,
                fallbackMode: dynamicParams ? // perform a blocking static render.
                rootParamKeys.length > 0 ? _fallback.FallbackMode.BLOCKING_STATIC_RENDER : fallbackMode : _fallback.FallbackMode.NOT_FOUND,
                fallbackRootParams: rootParamKeys
            });
        }
        filterUniqueParams(routeParamKeys, validateParams(page, regex, isRoutePPREnabled, routeParamKeys, rootParamKeys, routeParams)).forEach((params)=>{
            let pathname = page;
            let encodedPathname = page;
            const fallbackRouteParams = [];
            for (const key of routeParamKeys){
                if (fallbackRouteParams.length > 0) {
                    // This is a partial route, so we should add the value to the
                    // fallbackRouteParams.
                    fallbackRouteParams.push(key);
                    continue;
                }
                let paramValue = params[key];
                if (!paramValue) {
                    if (isRoutePPREnabled) {
                        // This is a partial route, so we should add the value to the
                        // fallbackRouteParams.
                        fallbackRouteParams.push(key);
                        continue;
                    } else {
                        // This route is not complete, and we aren't performing a partial
                        // prerender, so we should return, skipping this route.
                        return;
                    }
                }
                const { repeat, optional } = regex.groups[key];
                let replaced = `[${repeat ? '...' : ''}${key}]`;
                if (optional) {
                    replaced = `[${replaced}]`;
                }
                pathname = pathname.replace(replaced, (0, _utils.encodeParam)(paramValue, (value)=>(0, _escapepathdelimiters.default)(value, true)));
                encodedPathname = encodedPathname.replace(replaced, (0, _utils.encodeParam)(paramValue, encodeURIComponent));
            }
            const fallbackRootParams = rootParamKeys.filter((param)=>fallbackRouteParams.includes(param));
            result.prerenderedRoutes ??= [];
            result.prerenderedRoutes.push({
                pathname: (0, _utils.normalizePathname)(pathname),
                encodedPathname: (0, _utils.normalizePathname)(encodedPathname),
                fallbackRouteParams,
                fallbackMode: dynamicParams ? // perform a blocking static render.
                fallbackRootParams.length > 0 ? _fallback.FallbackMode.BLOCKING_STATIC_RENDER : fallbackMode : _fallback.FallbackMode.NOT_FOUND,
                fallbackRootParams
            });
        });
    }
    await afterRunner.executeAfter();
    return result;
}

//# sourceMappingURL=app.js.map