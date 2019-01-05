var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { action, computed, observable, runInAction, toJS } from 'mobx';
import { has, set } from 'lodash';
export function createStoreProxy(data) {
    class StoreProxy {
        constructor(data) {
            this._data = observable(data);
            this.meta = observable({});
            let proto = Object.getPrototypeOf(this);
            Object.keys(data).forEach(key => {
                Object.defineProperty(proto, key, {
                    get: () => {
                        return this._data[key];
                    },
                    set: (val) => {
                        runInAction(() => this._data[key] = val);
                    },
                    enumerable: true,
                    configurable: true,
                });
                __decorate([computed, __metadata('design:type', Object), __metadata('design:paramtypes', [])], proto, key, null);
            });
        }
        set(prop, value) {
            set(this._data, prop, value); // prop         = prop.split('.').slice(1).join('.')
            return this;
        }
        has(prop) { return has(this._data, prop); }
        toJS() { return toJS(this._data); }
    }
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], StoreProxy.prototype, "set", null);
    return new StoreProxy(data);
}
