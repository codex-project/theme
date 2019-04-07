Object.defineProperty(exports, "__esModule", { value: true });
const testLoader = function (source, sourceMap) {
    let { resourcePath, rootContext, context } = this;
    let a = { resourcePath, rootContext, context };
    return source;
};
exports.default = testLoader;
//# sourceMappingURL=test-loader.js.map