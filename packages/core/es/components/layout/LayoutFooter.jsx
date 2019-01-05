var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as React from 'react';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { Layout } from 'antd';
import './layout.mscss';
const { Footer } = Layout;
const log = require('debug')('components:layout:footer');
let LayoutFooter = class LayoutFooter extends React.Component {
    render() {
        const { children } = this.props;
        const { footer } = this.store.layout;
        const { computedStyle, computedClass } = footer;
        return (<Footer styleName="footer" style={computedStyle} className={computedClass}>
                {children}
            </Footer>);
    }
};
LayoutFooter.displayName = 'LayoutFooter';
LayoutFooter.defaultProps = {};
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], LayoutFooter.prototype, "store", void 0);
LayoutFooter = __decorate([
    hot(module),
    observer
], LayoutFooter);
export { LayoutFooter };
