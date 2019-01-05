var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { hot } from 'decorators';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
const log = require('debug')('pages:home');
let HomePage = class HomePage extends React.Component {
    render() {
        return (<div className="transition-item detail-page">
                <h2>HomePage</h2>
                <a onClick={(e) => __awaiter(this, void 0, void 0, function* () {
            let project = yield this.store.fetchDocument('codex', 'master', 'index');
            log(project);
        })}>project</a>
            </div>);
    }
};
HomePage.displayName = 'HomePage';
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], HomePage.prototype, "store", void 0);
HomePage = __decorate([
    hot(module)
], HomePage);
export default HomePage;
