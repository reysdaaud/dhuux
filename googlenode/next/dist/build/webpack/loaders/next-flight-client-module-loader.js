"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _getpagestaticinfo = require("../../analysis/get-page-static-info");
const _getmodulebuildinfo = require("./get-module-build-info");
const flightClientModuleLoader = function transformSource(source, sourceMap) {
    // Avoid buffer to be consumed
    if (typeof source !== 'string') {
        throw Object.defineProperty(new Error('Expected source to have been transformed to a string.'), "__NEXT_ERROR_CODE", {
            value: "E429",
            enumerable: false,
            configurable: true
        });
    }
    if (!this._module) {
        return source;
    }
    // Assign the RSC meta information to buildInfo.
    const buildInfo = (0, _getmodulebuildinfo.getModuleBuildInfo)(this._module);
    buildInfo.rsc = (0, _getpagestaticinfo.getRSCModuleInformation)(source, false);
    let prefix = '';
    if (process.env.BUILTIN_FLIGHT_CLIENT_ENTRY_PLUGIN) {
        const rscModuleInformationJson = JSON.stringify(buildInfo.rsc);
        prefix = `/* __rspack_internal_rsc_module_information_do_not_use__ ${rscModuleInformationJson} */\n`;
        source = prefix + source;
    }
    // This is a server action entry module in the client layer. We need to
    // create re-exports of "virtual modules" to expose the reference IDs to the
    // client separately so they won't be always in the same one module which is
    // not splittable. This server action module tree shaking is only applied in
    // production mode. In development mode, we want to preserve the original
    // modules (as transformed by SWC) to ensure that source mapping works.
    if (buildInfo.rsc.actionIds && process.env.NODE_ENV === 'production') {
        return prefix + Object.entries(buildInfo.rsc.actionIds).map(([id, name])=>{
            return `export { ${name} } from 'next-flight-server-reference-proxy-loader?id=${id}&name=${name}!'`;
        }).join('\n');
    }
    return this.callback(null, source, sourceMap);
};
const _default = flightClientModuleLoader;

//# sourceMappingURL=next-flight-client-module-loader.js.map