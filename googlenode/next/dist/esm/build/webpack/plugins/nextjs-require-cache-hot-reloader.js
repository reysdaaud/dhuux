import { deleteCache } from '../../../server/dev/require-cache';
import { clearModuleContext } from '../../../server/web/sandbox';
import path from 'path';
const RUNTIME_NAMES = [
    'webpack-runtime',
    'webpack-api-runtime'
];
const PLUGIN_NAME = 'NextJsRequireCacheHotReloader';
// This plugin flushes require.cache after emitting the files. Providing 'hot reloading' of server files.
export class NextJsRequireCacheHotReloader {
    constructor(opts){
        this.prevAssets = null;
        this.serverComponents = opts.serverComponents;
    }
    apply(compiler) {
        compiler.hooks.assetEmitted.tap(PLUGIN_NAME, (_file, { targetPath })=>{
            // Clear module context in this process
            clearModuleContext(targetPath);
            deleteCache(targetPath);
        });
        compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async (compilation)=>{
            for (const name of RUNTIME_NAMES){
                const runtimeChunkPath = path.join(compilation.outputOptions.path, `${name}.js`);
                deleteCache(runtimeChunkPath);
            }
            // we need to make sure to clear all server entries from cache
            // since they can have a stale webpack-runtime cache
            // which needs to always be in-sync
            const entries = [
                ...compilation.entrypoints.keys()
            ].filter((entry)=>{
                const isAppPath = entry.toString().startsWith('app/');
                return entry.toString().startsWith('pages/') || isAppPath;
            });
            for (const page of entries){
                const outputPath = path.join(compilation.outputOptions.path, page + '.js');
                deleteCache(outputPath);
            }
        });
    }
}

//# sourceMappingURL=nextjs-require-cache-hot-reloader.js.map