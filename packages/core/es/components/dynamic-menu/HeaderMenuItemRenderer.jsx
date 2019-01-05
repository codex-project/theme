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
import { Col, Menu as AntdMenu, Row } from 'antd';
import { getRandomId } from 'utils/general';
import './HeaderMenuItemRenderer.mscss';
import { MenuItemIcon } from './MenuItemIcon';
import { NavLink } from 'react-router-dom';
const { SubMenu, Item } = AntdMenu;
const log = require('debug')('components:HeaderMenuItemRenderer');
let HeaderMenuItemRenderer = class HeaderMenuItemRenderer extends React.Component {
    render() {
        if (!this.props.item)
            return null;
        let _a = this.props, { item, fontSize, iconStyle, color, items, rendererMaxLevel, renderer } = _a, props = __rest(_a, ["item", "fontSize", "iconStyle", "color", "items", "rendererMaxLevel", "renderer"]);
        const { icon, sublabel, label } = item;
        const content = (<Row type="flex" justify="start" key={getRandomId(6)}>
                {icon ? <Col order={1} styleName="icon-col"> <MenuItemIcon styleName="icon" item={item}/> </Col> : null}
                <Col order={2} styleName="icon-col">
                    <Row styleName="label">{label}</Row>
                    <Row styleName="sublabel">{sublabel}</Row>
                </Col>
            </Row>);
        return (<Item key={item.id} {...props} styleName="header-menu-item">
                {item.type === 'link' ?
            <a href={item.href} target={item.target} key={getRandomId(6)}>{content}</a> :
            item.type === 'router-link' ?
                <NavLink to={item.to} key={getRandomId(6)}>{content}</NavLink> :
                content}
            </Item>);
    }
};
HeaderMenuItemRenderer.displayName = 'HeaderMenuItemRenderer';
HeaderMenuItemRenderer = __decorate([
    hot(module, true),
    MenuItemRenderer('header')
], HeaderMenuItemRenderer);
export { HeaderMenuItemRenderer };
