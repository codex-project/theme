Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
class AssetPathSubstitutionPlugin {
    constructor(options = {}) {
        this.options = options;
    }
    getDefaultEntryPoint(compilation) {
        if (this.options.defaultEntryPoint)
            return this.options.defaultEntryPoint;
        let keys = Array.from(compilation.entrypoints.keys());
        if (keys.length > 0)
            return keys[0];
        return 'main';
    }
    apply(compiler) {
        this.compiler = compiler;
        const ChunkGroup = require('webpack/lib/ChunkGroup');
        const getRootParent = (group, call = 0) => {
            let parents = group.getParents();
            if (parents.length === 0 || call > 30)
                return group;
            return getRootParent(parents[0], call++);
        };
        compiler.hooks.compilation.tap('BUILD', (compilation) => {
            let prevChunk;
            const alterAssetPath = (path, data) => {
                if (typeof path === 'function') {
                    return path;
                }
                if (!data.chunk) {
                    return path;
                }
                let chunk = data.chunk;
                if (/\[entrypoint\]/gi.test(path)) {
                    if (!chunk.groupsIterable) {
                        chunk = prevChunk;
                        if (!chunk || !chunk.groupsIterable) {
                            return path;
                        }
                    }
                    let chunkName = chunk && (chunk.name || chunk.id);
                    let entrypoint = this.getDefaultEntryPoint(compilation);
                    if (compilation.entrypoints.has(chunkName)) {
                        entrypoint = chunkName;
                    }
                    else {
                        let groups = Array.from(chunk.groupsIterable);
                        if (groups.length > 0) {
                            let group = groups[groups.length - 1];
                            if (group instanceof ChunkGroup) {
                                let rootParent = getRootParent(group);
                                entrypoint = rootParent.name || entrypoint;
                            }
                        }
                    }
                    if (compilation.entrypoints.has(entrypoint)) {
                        path = path.replace(/\[entrypoint\]/gi, entrypoint);
                    }
                    else {
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
                    tap.fn = (path, data) => {
                        path = fn(path, data);
                        if (/\[entrypoint\]/gi.test(path)) {
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
exports.AssetPathSubstitutionPlugin = AssetPathSubstitutionPlugin;
