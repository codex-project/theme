// import BaseConfig,{LoaderOptions} from 'webpack-chain';
import { LoaderOptions, Plugin } from 'webpack-chain';
import * as path from 'path';
import { Configuration, Plugin as WebpackPlugin } from 'webpack';
import { ChainData } from './ChainData';
import { TransformOptions } from 'babel-core';
// import { TransformOptions } from 'babel-core';
import BaseConfig = require('webpack-chain');

// export const Chain=1;

export class ChainPlugin<P> extends Plugin<P> {
    public use<T extends any[]>(plugin: PluginConstructor, args?: T): this {
        return super.use(plugin, args);
    }
}

export interface PluginConstructor<T extends any[] = any[]> {
    new(...args: T): WebpackPlugin

    prototype: WebpackPlugin
}

export class Chain extends BaseConfig {
    data: ChainData;
    _options: InitBaseOptions;

    get isDev(): boolean { return this.get('mode') === 'development';}

    get isProd(): boolean { return this.get('mode') === 'production';}

    constructor(_options: InitBaseOptions) {
        super();
        this._options = _options;
        this.set('mode', _options.mode);
        this.data = new ChainData();
    }

    srcPath = (...parts) => path.resolve(this._options.sourceDir, ...parts);
    outPath = (...parts) => path.resolve(this._options.outputDir, ...parts);

    toConfigHandlers = [];

    onToConfig(handler: (this: this, config?: Configuration) => Configuration) {
        this.toConfigHandlers.push(handler);
        return this;
    }

    public toConfig(): Configuration {
        let config = super.toConfig();
        if ( this.toConfigHandlers ) {
            this.toConfigHandlers.forEach(handler => {
                config = handler(config);
            });
        }
        return config;
    }

    public plugin(name: string): ChainPlugin<this> {
        return super.plugin(name);
    }
}

export interface InitBaseOptions {
    mode: 'production' | 'development'
    sourceDir?: string
    outputDir?: string
}


export interface BabelLoaderOptions extends TransformOptions, LoaderOptions {
    customize?: string
    cacheDirectory?: boolean
    cacheCompression?: boolean
    compact?: boolean
    configFile?: boolean
}

export interface ForkTSCheckerOptions {
    typescript?: string;
    tsconfig?: string;
    compilerOptions?: object;
    tslint?: string | true;
    watch?: string | string[];
    async?: boolean;
    ignoreDiagnostics?: number[];
    ignoreLints?: string[];
    reportFiles?: string[];
    colors?: boolean;
    logger?: any;
    formatter?: 'default' | 'codeframe' | any;
    formatterOptions?: any;
    silent?: boolean;
    checkSyntacticErrors?: boolean;
    memoryLimit?: number;
    workers?: number;
    vue?: boolean;
}
