import { RSC_MOD_REF_PROXY_ALIAS } from '../../../../lib/constants';
import { BARREL_OPTIMIZATION_PREFIX, RSC_MODULE_TYPES } from '../../../../shared/lib/constants';
import { warnOnce } from '../../../../shared/lib/utils/warn-once';
import { getRSCModuleInformation } from '../../../analysis/get-page-static-info';
import { formatBarrelOptimizedResource } from '../../utils';
import { getModuleBuildInfo } from '../get-module-build-info';
const noopHeadPath = require.resolve('next/dist/client/components/noop-head');
// For edge runtime it will be aliased to esm version by webpack
const MODULE_PROXY_PATH = 'next/dist/build/webpack/loaders/next-flight-loader/module-proxy';
export function getAssumedSourceType(mod, sourceType) {
    var _buildInfo_rsc, _buildInfo_rsc1;
    const buildInfo = getModuleBuildInfo(mod);
    const detectedClientEntryType = buildInfo == null ? void 0 : (_buildInfo_rsc = buildInfo.rsc) == null ? void 0 : _buildInfo_rsc.clientEntryType;
    const clientRefs = (buildInfo == null ? void 0 : (_buildInfo_rsc1 = buildInfo.rsc) == null ? void 0 : _buildInfo_rsc1.clientRefs) || [];
    // It's tricky to detect the type of a client boundary, but we should always
    // use the `module` type when we can, to support `export *` and `export from`
    // syntax in other modules that import this client boundary.
    if (sourceType === 'auto') {
        if (detectedClientEntryType === 'auto') {
            if (clientRefs.length === 0) {
                // If there's zero export detected in the client boundary, and it's the
                // `auto` type, we can safely assume it's a CJS module because it doesn't
                // have ESM exports.
                return 'commonjs';
            } else if (!clientRefs.includes('*')) {
                // Otherwise, we assume it's an ESM module.
                return 'module';
            }
        } else if (detectedClientEntryType === 'cjs') {
            return 'commonjs';
        }
    }
    return sourceType;
}
export default function transformSource(source, sourceMap) {
    var _module_matchResource, _buildInfo_rsc, _buildInfo_rsc1;
    // Avoid buffer to be consumed
    if (typeof source !== 'string') {
        throw Object.defineProperty(new Error('Expected source to have been transformed to a string.'), "__NEXT_ERROR_CODE", {
            value: "E429",
            enumerable: false,
            configurable: true
        });
    }
    const module = this._module;
    // Assign the RSC meta information to buildInfo.
    // Exclude next internal files which are not marked as client files
    const buildInfo = getModuleBuildInfo(module);
    buildInfo.rsc = getRSCModuleInformation(source, true);
    let prefix = '';
    if (process.env.BUILTIN_FLIGHT_CLIENT_ENTRY_PLUGIN) {
        const rscModuleInformationJson = JSON.stringify(buildInfo.rsc);
        prefix = `/* __rspack_internal_rsc_module_information_do_not_use__ ${rscModuleInformationJson} */\n`;
        source = prefix + source;
    }
    // Resource key is the unique identifier for the resource. When RSC renders
    // a client module, that key is used to identify that module across all compiler
    // layers.
    //
    // Usually it's the module's file path + the export name (e.g. `foo.js#bar`).
    // But with Barrel Optimizations, one file can be splitted into multiple modules,
    // so when you import `foo.js#bar` and `foo.js#baz`, they are actually different
    // "foo.js" being created by the Barrel Loader (one only exports `bar`, the other
    // only exports `baz`).
    //
    // Because of that, we must add another query param to the resource key to
    // differentiate them.
    let resourceKey = this.resourcePath;
    if ((_module_matchResource = module.matchResource) == null ? void 0 : _module_matchResource.startsWith(BARREL_OPTIMIZATION_PREFIX)) {
        resourceKey = formatBarrelOptimizedResource(resourceKey, module.matchResource);
    }
    // A client boundary.
    if (((_buildInfo_rsc = buildInfo.rsc) == null ? void 0 : _buildInfo_rsc.type) === RSC_MODULE_TYPES.client) {
        const assumedSourceType = getAssumedSourceType(module, sourceTypeFromModule(module));
        const clientRefs = buildInfo.rsc.clientRefs;
        const stringifiedResourceKey = JSON.stringify(resourceKey);
        if (assumedSourceType === 'module') {
            if (clientRefs.length === 0) {
                return this.callback(null, 'export {}');
            }
            if (clientRefs.includes('*')) {
                this.callback(Object.defineProperty(new Error(`It's currently unsupported to use "export *" in a client boundary. Please use named exports instead.`), "__NEXT_ERROR_CODE", {
                    value: "E46",
                    enumerable: false,
                    configurable: true
                }));
                return;
            }
            let esmSource = prefix + `\
import { registerClientReference } from "react-server-dom-webpack/server.edge";
`;
            for (const ref of clientRefs){
                if (ref === 'default') {
                    esmSource += `export default registerClientReference(
function() { throw new Error(${JSON.stringify(`Attempted to call the default \
export of ${stringifiedResourceKey} from the server, but it's on the client. \
It's not possible to invoke a client function from the server, it can only be \
rendered as a Component or passed to props of a Client Component.`)}); },
${stringifiedResourceKey},
"default",
);\n`;
                } else {
                    esmSource += `export const ${ref} = registerClientReference(
function() { throw new Error(${JSON.stringify(`Attempted to call ${ref}() from \
the server but ${ref} is on the client. It's not possible to invoke a client \
function from the server, it can only be rendered as a Component or passed to \
props of a Client Component.`)}); },
${stringifiedResourceKey},
${JSON.stringify(ref)},
);`;
                }
            }
            return this.callback(null, esmSource, sourceMap);
        } else if (assumedSourceType === 'commonjs') {
            let cjsSource = prefix + `\
const { createProxy } = require("${MODULE_PROXY_PATH}")

module.exports = createProxy(${stringifiedResourceKey})
`;
            return this.callback(null, cjsSource, sourceMap);
        }
    }
    if (((_buildInfo_rsc1 = buildInfo.rsc) == null ? void 0 : _buildInfo_rsc1.type) !== RSC_MODULE_TYPES.client) {
        if (noopHeadPath === this.resourcePath) {
            warnOnce(`Warning: You're using \`next/head\` inside the \`app\` directory, please migrate to the Metadata API. See https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-3-migrating-nexthead for more details.`);
        }
    }
    const replacedSource = source.replace(RSC_MOD_REF_PROXY_ALIAS, MODULE_PROXY_PATH);
    this.callback(null, replacedSource, sourceMap);
}
function sourceTypeFromModule(module) {
    const moduleType = module.type;
    switch(moduleType){
        case 'javascript/auto':
            return 'auto';
        case 'javascript/dynamic':
            return 'script';
        case 'javascript/esm':
            return 'module';
        default:
            throw Object.defineProperty(new Error('Unexpected module type ' + moduleType), "__NEXT_ERROR_CODE", {
                value: "E651",
                enumerable: false,
                configurable: true
            });
    }
}

//# sourceMappingURL=index.js.map