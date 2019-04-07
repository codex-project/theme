Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ChainData_1 = require("./ChainData");
// import { TransformOptions } from 'babel-core';
const BaseConfig = require("webpack-chain");
// export const Chain=1;
class Chain extends BaseConfig {
    constructor(_options) {
        super();
        this.srcPath = (...parts) => path.resolve(this._options.sourceDir, ...parts);
        this.outPath = (...parts) => path.resolve(this._options.outputDir, ...parts);
        this.toConfigHandlers = [];
        this._options = _options;
        this.set('mode', _options.mode);
        this.data = new ChainData_1.ChainData();
    }
    get isDev() { return this.get('mode') === 'development'; }
    get isProd() { return this.get('mode') === 'production'; }
    onToConfig(handler) {
        this.toConfigHandlers.push(handler);
        return this;
    }
    toConfig() {
        let config = super.toConfig();
        if (this.toConfigHandlers) {
            this.toConfigHandlers.forEach(handler => {
                config = handler(config);
            });
        }
        return config;
    }
}
exports.Chain = Chain;
