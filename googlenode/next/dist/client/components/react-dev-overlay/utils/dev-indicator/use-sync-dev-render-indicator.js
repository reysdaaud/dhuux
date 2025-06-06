"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useSyncDevRenderIndicator", {
    enumerable: true,
    get: function() {
        return useSyncDevRenderIndicator;
    }
});
const NOOP = (fn)=>fn();
const useSyncDevRenderIndicator = ()=>{
    let syncDevRenderIndicator = NOOP;
    if (process.env.NODE_ENV === 'development') {
        const { useSyncDevRenderIndicatorInternal } = require('./use-sync-dev-render-indicator-internal');
        // eslint-disable-next-line react-hooks/rules-of-hooks
        syncDevRenderIndicator = useSyncDevRenderIndicatorInternal();
    }
    return syncDevRenderIndicator;
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=use-sync-dev-render-indicator.js.map