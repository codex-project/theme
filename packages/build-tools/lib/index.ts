import { WebpackAppConfigOptions } from './webpack-app-config';
import { WebpackAppPluginConfigOptions } from './webpack-app-plugin-config';

export function getLibraryBuildTools() {}

export function getAppBuildTools(options: WebpackAppConfigOptions = {}) {
    const chain = require('./webpack-app-config').default(options);

    return {chain};
}

export function getAppPluginBuildTools(options: WebpackAppPluginConfigOptions = {}) {
    const chain = require('./webpack-app-plugin-config').default(options);

    return {chain};
}
