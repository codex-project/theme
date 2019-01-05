var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Spin as AntdSpin } from 'antd';
// import { Icon, IconProps } from 'components/icon';
import { hot } from 'decorators';
import * as React from 'react';
import './index.scss';
let Spin = class Spin extends React.PureComponent {
    render() {
        const _a = this.props, { icon, iconStyle, prefixCls } = _a, props = __rest(_a, ["icon", "iconStyle", "prefixCls"]);
        return (<AntdSpin prefixCls="awesome-spin" indicator={<i className={'fa fa-spin fa-3x fa-fw fa-' + icon} style={iconStyle}/>} {...props || {}}/>);
    }
};
Spin.displayName = 'Spin';
Spin.defaultProps = {
    icon: 'circle-o-notch',
};
Spin = __decorate([
    hot(module)
], Spin);
export { Spin };
