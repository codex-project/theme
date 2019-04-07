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
const fs_1 = __importDefault(require("fs"));
const less_1 = __importDefault(require("less"));
const scss_to_json_1 = __importDefault(require("scss-to-json"));
const extractVariablesLessPlugin_1 = __importDefault(require("./extractVariablesLessPlugin"));
const cache = {
    lessLastModified: 0,
    lessEntry: null,
    lessVariableOverrides: null,
    lessVariables: null,
    scssLastModified: null,
    rawTheme: null,
};
const _extractLessVariables = (input, filename, modifyVars) => {
    return new Promise((resolve, reject) => {
        less_1.default.render(input, {
            filename,
            modifyVars,
            javascriptEnabled: true,
            insecure: true,
            plugins: [
                new extractVariablesLessPlugin_1.default({
                    callback: variables => resolve(variables),
                }),
            ],
        });
    });
};
/**
 * Return values of compiled Less variables from a compilable entry point.
 * @param {string} lessEntryPath - Root Less file from which to extract variables.
 * @param {Object} variableOverrides - Variable overrides of the form { '@var': 'value' } to use
 *   during compilation.
 * @return {Object} Object of the form { 'variable': 'value' }.
 */
exports.extractLessVariables = (lessEntryPath, variableOverrides = {}) => __awaiter(this, void 0, void 0, function* () {
    let lastModified = fs_1.default.statSync(lessEntryPath).mtime.getTime();
    if (lastModified > cache.lessLastModified) {
        cache.lessLastModified = lastModified;
        cache.lessEntry = fs_1.default.readFileSync(lessEntryPath, 'utf8');
        cache.lessVariables = null;
    }
    if (variableOverrides !== cache.lessVariables) {
        cache.lessVariableOverrides = variableOverrides;
        cache.lessVariables = null;
    }
    if (!cache.lessVariables) {
        cache.lessVariables = yield _extractLessVariables(cache.lessEntry, lessEntryPath, variableOverrides);
    }
    return cache.lessVariables;
});
/**
 * Read variables from a SCSS theme file into an object with Less-style variable names as keys.
 * @param {string} themeScssPath - Path to SCSS file containing only SCSS variables.
 * @return {Object} Object of the form { '@variable': 'value' }.
 */
exports.loadScssThemeAsLess = (themeScssPath) => {
    let lastModified = fs_1.default.statSync(themeScssPath).mtime.getTime();
    if (!cache.rawTheme || lastModified > cache.scssLastModified) {
        try {
            cache.rawTheme = scss_to_json_1.default(themeScssPath);
            cache.scssLastModified = lastModified;
        }
        catch (error) {
            throw new Error(`Could not compile the SCSS theme file "${themeScssPath}" for the purpose of variable ` +
                'extraction. This is likely because it contains a Sass error.');
        }
    }
    const theme = {};
    Object.keys(cache.rawTheme).forEach((sassVariableName) => {
        const lessVariableName = sassVariableName.replace(/^\$/, '@');
        theme[lessVariableName] = cache.rawTheme[sassVariableName];
    });
    return theme;
};
/**
 * Use SCSS theme file to seed a full set of Ant Design's theme variables returned in SCSS.
 * @param {string} themeScssPath - Path to SCSS file containing SCSS variables meaningful to Ant
 *   Design.
 * @return {string} A string representing an SCSS file containing all the theme and color
 *   variables used in Ant Design.
 */
exports.compileThemeVariables = (themeScssPath) => {
    const themeEntryPath = require.resolve('antd/lib/style/themes/default.less');
    const variableOverrides = themeScssPath ? exports.loadScssThemeAsLess(themeScssPath) : {};
    return exports.extractLessVariables(themeEntryPath, variableOverrides)
        .then(variables => (Object.entries(variables)
        .map(([name, value]) => `$${name}: ${value};\n`)
        .join('')));
};
//# sourceMappingURL=utils.js.map