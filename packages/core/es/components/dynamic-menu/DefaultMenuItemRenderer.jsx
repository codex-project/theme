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
import * as React from 'react';
import { hot } from 'decorators';
import { MenuItemRenderer } from './DynamicMenu';
import { Menu as AntdMenu } from 'antd';
import { MenuItemIcon } from './MenuItemIcon';
const { SubMenu, Item } = AntdMenu;
const log = require('debug')('components:DefaultMenuItemRenderer');
let DefaultMenuItemRenderer = class DefaultMenuItemRenderer extends React.Component {
    render() {
        if (!this.props.item)
            return null;
        let _a = this.props, { item, fontSize, iconStyle, color } = _a, props = __rest(_a, ["item", "fontSize", "iconStyle", "color"]);
        let label = item.label;
        return (<Item key={item.id} {...props}>
                <span style={{ fontSize, paddingRight: iconStyle.paddingRight }}>
                    <MenuItemIcon item={item} iconStyle={iconStyle} fontSize={fontSize}/>
                    {label}
                </span>
            </Item>);
    }
};
DefaultMenuItemRenderer.displayName = 'DefaultMenuItemRenderer';
DefaultMenuItemRenderer = __decorate([
    hot(module, true),
    MenuItemRenderer('default')
], DefaultMenuItemRenderer);
export { DefaultMenuItemRenderer };
