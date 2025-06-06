"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrefetchRSCPathnameNormalizer", {
    enumerable: true,
    get: function() {
        return PrefetchRSCPathnameNormalizer;
    }
});
const _constants = require("../../../lib/constants");
const _suffix = require("./suffix");
class PrefetchRSCPathnameNormalizer extends _suffix.SuffixPathnameNormalizer {
    constructor(){
        super(_constants.RSC_PREFETCH_SUFFIX);
    }
    match(pathname) {
        if (pathname === '/__index' + _constants.RSC_PREFETCH_SUFFIX) {
            return true;
        }
        return super.match(pathname);
    }
    normalize(pathname, matched) {
        if (pathname === '/__index' + _constants.RSC_PREFETCH_SUFFIX) {
            return '/';
        }
        return super.normalize(pathname, matched);
    }
}

//# sourceMappingURL=prefetch-rsc.js.map