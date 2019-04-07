import fs from 'fs';

import less from 'less';
import scssToJson from 'scss-to-json';

import ExtractVariablesPlugin from './extractVariablesLessPlugin';

const cache = {
    lessLastModified     : 0,
    lessEntry            : null,
    lessVariableOverrides: null,
    lessVariables        : null,
    scssLastModified     : null,
    rawTheme             : null,
};

const _extractLessVariables = (input: string, filename: string, modifyVars: any) => {
    return new Promise((resolve, reject) => {
        less.render(input, {
            filename,
            modifyVars,
            javascriptEnabled: true,
            insecure         : true,
            plugins          : [
                new ExtractVariablesPlugin({
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
export const extractLessVariables = async (lessEntryPath, variableOverrides = {}) => {
    let lastModified = fs.statSync(lessEntryPath).mtime.getTime();
    if ( lastModified > cache.lessLastModified ) {
        cache.lessLastModified = lastModified;
        cache.lessEntry        = fs.readFileSync(lessEntryPath, 'utf8');
        cache.lessVariables    = null;
    }
    if ( variableOverrides !== cache.lessVariables ) {
        cache.lessVariableOverrides = variableOverrides;
        cache.lessVariables         = null;
    }
    if ( ! cache.lessVariables ) {
        cache.lessVariables = await _extractLessVariables(cache.lessEntry, lessEntryPath, variableOverrides);
    }
    return cache.lessVariables;
};


/**
 * Read variables from a SCSS theme file into an object with Less-style variable names as keys.
 * @param {string} themeScssPath - Path to SCSS file containing only SCSS variables.
 * @return {Object} Object of the form { '@variable': 'value' }.
 */
export const loadScssThemeAsLess = (themeScssPath) => {
    let lastModified = fs.statSync(themeScssPath).mtime.getTime();
    if ( ! cache.rawTheme || lastModified > cache.scssLastModified ) {
        try {
            cache.rawTheme         = scssToJson(themeScssPath);
            cache.scssLastModified = lastModified;
        } catch ( error ) {
            throw new Error(
                `Could not compile the SCSS theme file "${themeScssPath}" for the purpose of variable ` +
                'extraction. This is likely because it contains a Sass error.',
            );
        }
    }

    const theme = {};
    Object.keys(cache.rawTheme).forEach((sassVariableName) => {
        const lessVariableName    = sassVariableName.replace(/^\$/, '@');
        theme[ lessVariableName ] = cache.rawTheme[ sassVariableName ];
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
export const compileThemeVariables = (themeScssPath) => {
    const themeEntryPath    = require.resolve('antd/lib/style/themes/default.less');
    const variableOverrides = themeScssPath ? loadScssThemeAsLess(themeScssPath) : {};

    return extractLessVariables(themeEntryPath, variableOverrides)
        .then(variables => (
            Object.entries(variables)
                .map(([ name, value ]) => `$${name}: ${value};\n`)
                .join('')
        ));
};
