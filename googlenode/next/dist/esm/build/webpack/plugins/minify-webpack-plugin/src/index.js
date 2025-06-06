import { webpack, ModuleFilenameHelpers, sources, WebpackError } from 'next/dist/compiled/webpack/webpack';
import pLimit from 'next/dist/compiled/p-limit';
import { getCompilationSpan } from '../../../utils';
function buildError(error, file) {
    if (error.line) {
        return new WebpackError(`${file} from Minifier\n${error.message} [${file}:${error.line},${error.col}]${error.stack ? `\n${error.stack.split('\n').slice(1).join('\n')}` : ''}`);
    }
    if (error.stack) {
        return new WebpackError(`${file} from Minifier\n${error.message}\n${error.stack}`);
    }
    return new WebpackError(`${file} from Minifier\n${error.message}`);
}
const debugMinify = process.env.NEXT_DEBUG_MINIFY;
export class MinifyPlugin {
    constructor(options){
        this.options = options;
    }
    async optimize(compiler, compilation, assets, cache, { SourceMapSource, RawSource }) {
        const mangle = !this.options.noMangling;
        const compilationSpan = getCompilationSpan(compilation) || getCompilationSpan(compiler);
        const MinifierSpan = compilationSpan.traceChild('minify-webpack-plugin-optimize');
        if (compilation.name) {
            MinifierSpan.setAttribute('compilationName', compilation.name);
        }
        MinifierSpan.setAttribute('mangle', String(mangle));
        return MinifierSpan.traceAsyncFn(async ()=>{
            const assetsList = Object.keys(assets);
            const assetsForMinify = await Promise.all(assetsList.filter((name)=>{
                if (!ModuleFilenameHelpers.matchObject.bind(// eslint-disable-next-line no-undefined
                undefined, {
                    test: /\.[cm]?js(\?.*)?$/i
                })(name)) {
                    return false;
                }
                const res = compilation.getAsset(name);
                if (!res) {
                    console.log(name);
                    return false;
                }
                const { info } = res;
                // Skip double minimize assets from child compilation
                if (info.minimized) {
                    return false;
                }
                return true;
            }).map(async (name)=>{
                const { info, source } = compilation.getAsset(name);
                const eTag = cache.mergeEtags(cache.getLazyHashedEtag(source), JSON.stringify(this.options));
                const output = await cache.getPromise(name, eTag);
                if (debugMinify && debugMinify === '1') {
                    console.log(JSON.stringify({
                        name,
                        source: source.source().toString()
                    }), {
                        breakLength: Infinity,
                        maxStringLength: Infinity
                    });
                }
                return {
                    name,
                    info,
                    inputSource: source,
                    output,
                    eTag
                };
            }));
            let initializedWorker;
            // eslint-disable-next-line consistent-return
            const getWorker = ()=>{
                return {
                    minify: async (options)=>{
                        const result = await require('../../../../swc').minify(options.input, {
                            ...options.inputSourceMap ? {
                                sourceMap: {
                                    content: JSON.stringify(options.inputSourceMap)
                                }
                            } : {},
                            // Compress options are defined in crates/napi/src/minify.rs.
                            compress: false,
                            // Mangle options may be amended in crates/napi/src/minify.rs.
                            mangle,
                            module: 'unknown',
                            output: {
                                comments: false
                            }
                        });
                        return result;
                    }
                };
            };
            // The limit in the SWC minifier will be handled by Node.js
            const limit = pLimit(Infinity);
            const scheduledTasks = [];
            for (const asset of assetsForMinify){
                scheduledTasks.push(limit(async ()=>{
                    const { name, inputSource, eTag } = asset;
                    let { output } = asset;
                    const minifySpan = MinifierSpan.traceChild('minify-js');
                    minifySpan.setAttribute('name', name);
                    minifySpan.setAttribute('cache', typeof output === 'undefined' ? 'MISS' : 'HIT');
                    return minifySpan.traceAsyncFn(async ()=>{
                        if (!output) {
                            const { source: sourceFromInputSource, map: inputSourceMap } = inputSource.sourceAndMap();
                            const input = Buffer.isBuffer(sourceFromInputSource) ? sourceFromInputSource.toString() : sourceFromInputSource;
                            let minifiedOutput;
                            try {
                                minifiedOutput = await getWorker().minify({
                                    input,
                                    inputSourceMap
                                });
                            } catch (error) {
                                compilation.errors.push(buildError(error, name));
                                return;
                            }
                            const source = minifiedOutput.map ? new SourceMapSource(minifiedOutput.code, name, minifiedOutput.map, input, inputSourceMap, true) : new RawSource(minifiedOutput.code);
                            await cache.storePromise(name, eTag, {
                                source
                            });
                            output = {
                                source
                            };
                        }
                        const newInfo = {
                            minimized: true
                        };
                        compilation.updateAsset(name, output.source, newInfo);
                    });
                }));
            }
            await Promise.all(scheduledTasks);
            if (initializedWorker) {
                await initializedWorker.end();
            }
        });
    }
    apply(compiler) {
        var _compiler_webpack;
        const { SourceMapSource, RawSource } = (compiler == null ? void 0 : (_compiler_webpack = compiler.webpack) == null ? void 0 : _compiler_webpack.sources) || sources;
        const pluginName = this.constructor.name;
        compiler.hooks.thisCompilation.tap(pluginName, (compilation)=>{
            const cache = compilation.getCache('MinifierWebpackPlugin');
            const handleHashForChunk = (hash, _chunk)=>{
                // increment 'c' to invalidate cache
                hash.update('c');
            };
            const JSModulesHooks = webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation);
            JSModulesHooks.chunkHash.tap(pluginName, (chunk, hash)=>{
                if (!chunk.hasRuntime()) return;
                return handleHashForChunk(hash, chunk);
            });
            compilation.hooks.processAssets.tapPromise({
                name: pluginName,
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE
            }, (assets)=>this.optimize(compiler, compilation, assets, cache, {
                    SourceMapSource,
                    RawSource
                }));
            compilation.hooks.statsPrinter.tap(pluginName, (stats)=>{
                stats.hooks.print.for('asset.info.minimized').tap('minify-webpack-plugin', (minimized, { green, formatFlag })=>// eslint-disable-next-line no-undefined
                    minimized ? green(formatFlag('minimized')) : undefined);
            });
        });
    }
}

//# sourceMappingURL=index.js.map