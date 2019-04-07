import lessLoader from 'less-loader';
import { getOptions } from 'loader-utils';

import { extractLessVariables, loadScssThemeAsLess } from './utils';
import { getScssThemePath } from './loaderUtils';


/**
 * Modify less-loader's options with variable overrides extracted from the SCSS theme.
 * @param {Object} options - Options for less-loader.
 * @return {Object} Options modified to include theme variables in the modifyVars property.
 */
export const overloadLessLoaderOptions = (options) => {
    const scssThemePath = getScssThemePath(options);

    const themeModifyVars = loadScssThemeAsLess(scssThemePath);

    const newOptions = {
        ...options,
        modifyVars: {
            ...themeModifyVars,
            ...(options.modifyVars || {}),
        },
    };

    return newOptions;
};


/**
 * A wrapper around less-loader which overloads loader options and registers the theme file
 * as a watched dependency.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */
export default function antdLessLoader(...args) {
    const loaderContext = this;
    const callback      = loaderContext.async();
    const options       = getOptions(loaderContext);

    const newLoaderContext = { ...loaderContext };

    try {
        const newOptions = overloadLessLoaderOptions(options);
        delete newOptions.scssThemePath;

        extractLessVariables(require.resolve('antd/lib/style/themes/default.less'), newOptions.modifyVars)
            .then(variables => {
                Object.keys(variables).forEach(key => {
                    newOptions.modifyVars['@' + key] = variables[key];
                })
                newLoaderContext.query = newOptions;
                const scssThemePath = getScssThemePath(options);
                newLoaderContext.addDependency(scssThemePath);
                return lessLoader.call(newLoaderContext, ...args);
            })

            .catch((error) => {
                // Remove unhelpful stack from error.
                error.stack = undefined; // eslint-disable-line no-param-reassign
                callback(error);
            });
    } catch ( error ) {
        // Remove unhelpful stack from error.
        error.stack = undefined; // eslint-disable-line no-param-reassign
        callback(error);
    }
}
