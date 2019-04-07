import { compilation, Compiler as BaseCompiler } from 'webpack';
import { SyncHook, SyncWaterfallHook } from 'tapable';

export interface AssetPathSubstitutionPluginOptions {
    defaultEntryPoint?: string
}

export class AssetPathSubstitutionPlugin {
    compiler: Compiler;
    options: AssetPathSubstitutionPluginOptions;

    constructor(options: AssetPathSubstitutionPluginOptions = {}) {
        this.options = options;
    }

    getDefaultEntryPoint(compilation: Compilation) {
        if ( this.options.defaultEntryPoint ) return this.options.defaultEntryPoint;
        let keys = Array.from(compilation.entrypoints.keys());
        if ( keys.length > 0 ) return keys[ 0 ];
        return 'main';
    }

    apply(compiler: Compiler) {
        this.compiler    = compiler;
        const ChunkGroup = require('webpack/lib/ChunkGroup');

        const getRootParent = (group: ChunkGroup, call = 0) => {
            let parents = group.getParents();
            if ( parents.length === 0 || call > 30 ) return group;
            return getRootParent(parents[ 0 ], call ++);
        };

        compiler.hooks.compilation.tap('BUILD', (compilation: Compilation) => {
            let prevChunk;
            const alterAssetPath = (path: string | any, data: IData) => {
                if ( typeof path === 'function' ) {
                    return path;
                }
                if ( ! data.chunk ) {
                    return path;
                }
                let chunk = data.chunk;

                if ( /\[entrypoint\]/gi.test(path) ) {
                    if ( ! chunk.groupsIterable ) {
                        chunk = prevChunk;
                        if ( ! chunk || ! chunk.groupsIterable ) {
                            return path;
                        }
                    }
                    let chunkName  = chunk && (chunk.name || chunk.id);
                    let entrypoint = this.getDefaultEntryPoint(compilation);
                    if ( compilation.entrypoints.has(chunkName) ) {
                        entrypoint = chunkName;
                    } else {
                        let groups = Array.from(chunk.groupsIterable);
                        if ( groups.length > 0 ) {
                            let group: ChunkGroup = groups[ groups.length - 1 ] as any;
                            if ( group instanceof ChunkGroup ) {
                                let rootParent = getRootParent(group);
                                entrypoint     = rootParent.name || entrypoint;
                            }
                        }
                    }
                    if ( compilation.entrypoints.has(entrypoint) ) {
                        path = path.replace(/\[entrypoint\]/gi, entrypoint);
                    } else {
                    }
                }
                return path;
            };
            compilation.mainTemplate.hooks.requireExtensions.intercept({
                call: (source, chunk, hash) => {
                    prevChunk = chunk;
                },
            });
            compilation.mainTemplate.hooks.assetPath.intercept({
                register: tap => {
                    let fn = tap.fn;
                    tap.fn = (path: string, data: IData) => {
                        path = fn(path, data);
                        if ( /\[entrypoint\]/gi.test(path) ) {
                            path = alterAssetPath(path, data);
                        }
                        return path;
                    };
                    return tap;
                },
            });
            // compilation.mainTemplate.hooks.assetPath.tap('BUILD',alterAssetPath);
        });
    }
}

export declare class MultiModule extends Module {}

export declare class Chunk extends compilation.Chunk {
    filenameTemplate?: string;
    hash: string;
    hashWithLength: string;
    groupsIterable: WeakSet<compilation.ChunkGroup> | any;

    entryModule: MultiModule;
}

export declare interface ChunkTemplateHooks {
    hash: SyncHook
    hashForChunk: SyncHook
    modules: SyncWaterfallHook
    render: SyncWaterfallHook
    renderManifest: SyncWaterfallHook
    renderWithEntry: SyncWaterfallHook
}

export declare class ChunkTemplate extends compilation.ChunkTemplate {
    hooks: ChunkTemplateHooks;
}

export declare interface MainTemplateHooks {
    renderManifest: SyncWaterfallHook
    modules: SyncWaterfallHook
    moduleObj: SyncWaterfallHook
    requireEnsure: SyncWaterfallHook
    bootstrap: SyncWaterfallHook
    localVars: SyncWaterfallHook
    require: SyncWaterfallHook
    requireExtensions: SyncWaterfallHook
    beforeStartup: SyncWaterfallHook
    startup: SyncWaterfallHook
    render: SyncWaterfallHook
    renderWithEntry: SyncWaterfallHook
    moduleRequire: SyncWaterfallHook
    addModule: SyncWaterfallHook
    currentHash: SyncWaterfallHook
    assetPath: SyncWaterfallHook
    hash: SyncWaterfallHook
    hashForChunk: SyncWaterfallHook
    globalHashPaths: SyncWaterfallHook
    globalHash: SyncWaterfallHook
    hotBootstrap: SyncWaterfallHook
    jsonpScript: SyncWaterfallHook
}

export declare class ChunkGroup extends compilation.ChunkGroup {
    name: string;

    getParents(): ChunkGroup[]
}

export declare class MainTemplate extends compilation.MainTemplate {
    hooks: MainTemplateHooks;
    outputOptions: { publicPath: string };
}

export declare class Compiler extends BaseCompiler {
}

export declare class Compilation extends compilation.Compilation {
    chunkTemplate: ChunkTemplate;
    mainTemplate: MainTemplate;
}


export type OptionsItemCallback<T> = (chunk: Chunk) => T
export type OptionsItemTest = string | RegExp | OptionsItemCallback<boolean>
export type OptionsItemFilenameTemplate = string | OptionsItemCallback<string>

export interface OptionsItem {
    test: OptionsItemTest
    filenameTemplate?: OptionsItemFilenameTemplate
    custom?: OptionsItemCallback<void>
}

export interface Options {
    items?: OptionsItem[]
}

export declare class Module extends compilation.Module {
    id: string;
    renderedHash: string;
    hash: string;
    hashWithLength: string;
    name:string;
}


export declare interface IData {
    chunk?: Chunk
    module?: Module
    hash: string
    hashWithLength: string
    filename: string
    basename: string
    noChunkHash?: boolean
    query?: string
}
