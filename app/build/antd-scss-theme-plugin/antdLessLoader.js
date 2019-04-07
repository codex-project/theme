var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const less_loader_1 = __importDefault(require("less-loader"));
const loader_utils_1 = require("loader-utils");
const utils_1 = require("./utils");
const loaderUtils_1 = require("./loaderUtils");
/**
 * Modify less-loader's options with variable overrides extracted from the SCSS theme.
 * @param {Object} options - Options for less-loader.
 * @return {Object} Options modified to include theme variables in the modifyVars property.
 */
exports.overloadLessLoaderOptions = (options) => {
    const scssThemePath = loaderUtils_1.getScssThemePath(options);
    const themeModifyVars = utils_1.loadScssThemeAsLess(scssThemePath);
    const newOptions = Object.assign({}, options, { modifyVars: Object.assign({}, themeModifyVars, (options.modifyVars || {})) });
    return newOptions;
};
/**
 * A wrapper around less-loader which overloads loader options and registers the theme file
 * as a watched dependency.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */
function antdLessLoader(...args) {
    const loaderContext = this;
    const callback = loaderContext.async();
    const options = loader_utils_1.getOptions(loaderContext);
    const newLoaderContext = Object.assign({}, loaderContext);
    try {
        const newOptions = exports.overloadLessLoaderOptions(options);
        delete newOptions.scssThemePath;
        utils_1.extractLessVariables(require.resolve('antd/lib/style/themes/default.less'), newOptions.modifyVars)
            .then(variables => {
            Object.keys(variables).forEach(key => {
                newOptions.modifyVars['@' + key] = variables[key];
            });
            newLoaderContext.query = newOptions;
            const scssThemePath = loaderUtils_1.getScssThemePath(options);
            newLoaderContext.addDependency(scssThemePath);
            return less_loader_1.default.call(newLoaderContext, ...args);
        })
            .catch((error) => {
            // Remove unhelpful stack from error.
            error.stack = undefined; // eslint-disable-line no-param-reassign
            callback(error);
        });
    }
    catch (error) {
        // Remove unhelpful stack from error.
        error.stack = undefined; // eslint-disable-line no-param-reassign
        callback(error);
    }
}
exports.default = antdLessLoader;
//# sourceMappingURL=antdLessLoader.js.map