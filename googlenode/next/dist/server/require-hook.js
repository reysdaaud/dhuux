// Synchronously inject a require hook for webpack and webpack/. It's required to use the internal ncc webpack version.
// This is needed for userland plugins to attach to the same webpack instance as Next.js'.
// Individually compiled modules are as defined for the compilation in bundles/webpack/packages/*.
// This module will only be loaded once per process.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addHookAliases: null,
    defaultOverrides: null,
    hookPropertyMap: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    addHookAliases: function() {
        return addHookAliases;
    },
    defaultOverrides: function() {
        return defaultOverrides;
    },
    hookPropertyMap: function() {
        return hookPropertyMap;
    }
});
const path = require('path');
const mod = require('module');
const originalRequire = mod.prototype.require;
const resolveFilename = mod._resolveFilename;
let resolve = process.env.NEXT_MINIMAL ? __non_webpack_require__.resolve : require.resolve;
const hookPropertyMap = new Map();
const defaultOverrides = {
    'styled-jsx': path.dirname(resolve('styled-jsx/package.json')),
    'styled-jsx/style': resolve('styled-jsx/style'),
    'styled-jsx/style.js': resolve('styled-jsx/style')
};
const toResolveMap = (map)=>Object.entries(map).map(([key, value])=>[
            key,
            resolve(value)
        ]);
function addHookAliases(aliases = []) {
    for (const [key, value] of aliases){
        hookPropertyMap.set(key, value);
    }
}
addHookAliases(toResolveMap(defaultOverrides));
mod._resolveFilename = (function(originalResolveFilename, requestMap, request, parent, isMain, options) {
    const hookResolved = requestMap.get(request);
    if (hookResolved) request = hookResolved;
    return originalResolveFilename.call(mod, request, parent, isMain, options);
// We use `bind` here to avoid referencing outside variables to create potential memory leaks.
}).bind(null, resolveFilename, hookPropertyMap);
// This is a hack to make sure that if a user requires a Next.js module that wasn't bundled
// that needs to point to the rendering runtime version, it will point to the correct one.
// This can happen on `pages` when a user requires a dependency that uses next/image for example.
mod.prototype.require = function(request) {
    if (request.endsWith('.shared-runtime')) {
        return originalRequire.call(this, `next/dist/server/route-modules/pages/vendored/contexts/${path.basename(request, '.shared-runtime')}`);
    }
    return originalRequire.call(this, request);
};

//# sourceMappingURL=require-hook.js.map