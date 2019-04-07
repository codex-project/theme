var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const loader_utils_1 = require("loader-utils");
const sass_loader_1 = __importDefault(require("sass-loader"));
const importsToResolve_1 = __importDefault(require("sass-loader/lib/importsToResolve"));
const loaderUtils_1 = require("./loaderUtils");
const utils_1 = require("./utils");
const sassLoader = sass_loader_1.default;
/**
 * Utility returning a node-sass importer that provides access to all of antd's theme variables.
 * @param {string} themeScssPath - Path to SCSS file containing Ant Design theme variables.
 * @param {string} contents - The compiled content of the SCSS file at themeScssPath.
 * @returns {function} Importer that provides access to all compiled Ant Design theme variables
 *   when importing the theme file at themeScssPath.
 */
exports.themeImporter = (themeScssPath, contents) => (url, previousResolve, done) => {
    const request = loader_utils_1.urlToRequest(url);
    const pathsToTry = importsToResolve_1.default(request);
    const baseDirectory = path_1.default.dirname(previousResolve);
    for (let i = 0; i < pathsToTry.length; i += 1) {
        const potentialResolve = pathsToTry[i];
        if (path_1.default.resolve(baseDirectory, potentialResolve) === themeScssPath) {
            done({ contents });
            return;
        }
    }
    done();
};
let stack = [];
let prevNow = Date.now();
const l = (...args) => {
    let time = Date.now() - prevNow;
    stack.push({ time, args });
    console.log(time, ...args);
    prevNow = Date.now();
};
let cache = {
    lastModified: 0,
    contents: null,
    getContents(scssThemePath, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cache.contents === null) {
                cache.contents = yield fn(scssThemePath);
            }
            return cache.contents;
        });
    },
};
/**
 * Modify sass-loader's options so that all antd variables are imported from the SCSS theme file.
 * @param {Object} options - Options for sass-loader.
 * @return {Object} Options modified to includ a custom importer that handles the SCSS theme file.
 */
exports.overloadSassLoaderOptions = (options) => __awaiter(this, void 0, void 0, function* () {
    const newOptions = Object.assign({}, options);
    const scssThemePath = loaderUtils_1.getScssThemePath(options);
    // l('pre-compile');
    // const contents = await compileThemeVariables(scssThemePath);
    const contents = yield cache.getContents(scssThemePath, utils_1.compileThemeVariables);
    // l('post-compile');
    const extraImporter = exports.themeImporter(scssThemePath, contents);
    let importer;
    if ('importer' in options) {
        if (Array.isArray(options.importer)) {
            importer = [...options.importer, extraImporter];
        }
        else {
            importer = [options.importer, extraImporter];
        }
    }
    else {
        importer = extraImporter;
    }
    newOptions.importer = importer;
    return newOptions;
});
/**
 * A wrapper around sass-loader which overloads loader options to include a custom importer handling
 * variable imports from the SCSS theme file, and registers the theme file as a watched dependency.
 * @param {...*} args - Arguments passed to sass-loader.
 * @this {LoaderContext}
 * @return {undefined}
 */
function antdSassLoader(...args) {
    const loaderContext = this;
    const callback = loaderContext.async();
    const options = loader_utils_1.getOptions(loaderContext);
    const newLoaderContext = Object.assign({}, loaderContext);
    exports.overloadSassLoaderOptions(options)
        .then((newOptions) => {
        delete newOptions.scssThemePath; // eslint-disable-line no-param-reassign
        newLoaderContext.query = newOptions;
        const scssThemePath = loaderUtils_1.getScssThemePath(options);
        newLoaderContext.addDependency(scssThemePath);
        return sassLoader.call(newLoaderContext, ...args);
    })
        .catch((error) => {
        // Remove unhelpful stack from error.
        error.stack = undefined; // eslint-disable-line no-param-reassign
        callback(error);
    });
}
exports.default = antdSassLoader;
//# sourceMappingURL=antdSassLoader.js.map