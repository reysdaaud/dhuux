const isDev = process.env.NODE_ENV === 'development';
const isTurbopack = !!process.env.TURBOPACK;
export function getAssetQueryString(ctx, addTimestamp) {
    let qs = '';
    // In development we add the request timestamp to allow react to
    // reload assets when a new RSC response is received.
    // Turbopack handles HMR of assets itself and react doesn't need to reload them
    // so this approach is not needed for Turbopack.
    const shouldAddVersion = isDev && !isTurbopack && addTimestamp;
    if (shouldAddVersion) {
        qs += `?v=${ctx.requestTimestamp}`;
    }
    if (ctx.renderOpts.deploymentId) {
        qs += `${shouldAddVersion ? '&' : '?'}dpl=${ctx.renderOpts.deploymentId}`;
    }
    return qs;
}

//# sourceMappingURL=get-asset-query-string.js.map