Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
// export declare const get:any,set:any,has:any,unset:any,merge:any;
class ChainData {
    constructor() {
        this.data = {};
    }
    get(path, defaultValue) {
        return lodash_1.get(this['data'], path, defaultValue);
    }
    set(path, value) {
        lodash_1.set(this['data'], path, value);
        return this;
    }
    has(path) {
        return lodash_1.has(this['data'], path);
    }
    unset(path) {
        lodash_1.unset(this['data'], path);
        return this;
    }
    merge(data) {
        lodash_1.merge(this['data'], data);
        return this;
    }
}
exports.ChainData = ChainData;
// ChainData.prototype['data'] = {}
