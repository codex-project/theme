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
var DynamicMenu_1;
import React from 'react';
import { hot } from 'decorators';
import PropTypes from 'prop-types';
import { Layout, Menu as AntdMenu } from 'antd';
import { observer } from 'mobx-react';
import { getColor } from 'utils/colors';
import { MenuItemIcon } from './MenuItemIcon';
import { classes } from 'typestyle';
const log = require('debug')('components:DynamicMenu');
const { Sider } = Layout;
const { SubMenu, Item, Divider } = AntdMenu;
export function MenuItemRenderer(name) {
    return (TargetComponent) => {
        DynamicMenu.renderers[name] = TargetComponent;
        return TargetComponent;
    };
}
let DynamicMenu = DynamicMenu_1 = class DynamicMenu extends React.Component {
    constructor() {
        super(...arguments);
        this.onOpenChange = (openKeys) => {
            log('onOpenChange', openKeys);
        };
        this.onClick = (param) => {
            log('onClick', param);
            let { items } = this.props;
            let item = items.item(param.key);
            items.handleClick(item, param.domEvent);
            if (item.selected) {
                if (this.props.multiple === false) {
                    items.deselectAll().select(item);
                }
            }
            else {
                this.selectFromRoutePath();
            }
        };
        this.onTitleClick = (param) => {
            log('onTitleClick', param);
            let item = this.props.items.item(param.key);
            this.props.items.handleClick(item, param.domEvent);
        };
    }
    componentDidMount() {
        this.selectFromRoutePath();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.items !== nextProps.items) {
            this.selectFromRoutePath(nextProps.items);
        }
    }
    selectFromRoutePath(items = this.props.items) {
        if (this.props.selectFromRoutePath) {
            items.deselectAll();
            items.selectActiveFromRoute(true, !this.props.multiroot);
        }
    }
    renderMenuItem(item, level) {
        const { fontSize, iconStyle, color, mode, items } = this.props;
        const className = `item-${item.type}`;
        // if ( level === 0 && ! item.icon ) {
        //     item.icon = 'caret-right';
        // }
        switch (item.type) {
            case 'divider':
                return (<Divider key={item.id} className={className}>{mode === 'horizontal' ? '&nbsp' : null}</Divider>);
            case 'header':
                return (<Item key={item.id} className={className}><MenuItemIcon item={item} iconStyle={iconStyle} fontSize={fontSize}/>{item.label}</Item>);
            case 'sub-menu':
                return (<SubMenu className={className} key={item.id} title={<span style={{ fontSize, paddingRight: iconStyle.paddingRight }}><MenuItemIcon item={item} iconStyle={iconStyle} fontSize={fontSize}/> {item.label}</span>} onTitleClick={this.onTitleClick}>
                        {item.children.map(child => this.renderMenuItem(child, level + 1))}
                    </SubMenu>);
        }
        let renderer = this.props.renderer;
        if (level > this.props.rendererMaxLevel) {
            renderer = 'default';
        }
        if (DynamicMenu_1.renderers[renderer]) {
            const Component = DynamicMenu_1.renderers[renderer];
            let props = { level, className, fontSize, iconStyle, color };
            return <Component key={item.id} item={item} {...props || {}}/>;
        }
        return null;
    }
    render() {
        const _a = this.props, { children, className, multiple, multiroot, selectFromRoutePath, prefixCls, mode, fontSize, iconStyle, items, color, renderer, rendererMaxLevel } = _a, props = __rest(_a, ["children", "className", "multiple", "multiroot", "selectFromRoutePath", "prefixCls", "mode", "fontSize", "iconStyle", "items", "color", "renderer", "rendererMaxLevel"]);
        if (typeof items.selected !== 'function') {
            return null;
        }
        // log('render', { items, selected: items.selected().ids(), expanded: items.expanded().ids() });
        const menuClassName = classes(className, prefixCls, `${prefixCls}-${mode}`, `${prefixCls}-theme-${mode}`);
        return (<AntdMenu mode={mode} className={menuClassName} subMenuCloseDelay={0.6} style={{ fontSize, backgroundColor: getColor(color) }} selectedKeys={items.selected().ids()} openKeys={items.expanded().ids()} onClick={this.onClick} onOpenChange={this.onOpenChange} multiple={multiple} {...props}>
                {items.map(item => this.renderMenuItem(item, 0))}
            </AntdMenu>);
    }
};
DynamicMenu.displayName = 'DynamicMenu';
DynamicMenu.defaultProps = {
    iconStyle: { paddingRight: 20 },
    fontSize: 12,
    renderer: 'default',
    prefixCls: 'c-dmenu',
    mode: 'horizontal',
    rendererMaxLevel: 0,
    multiroot: false,
    multiple: false,
    selectFromRoutePath: true,
};
DynamicMenu.renderers = {};
DynamicMenu.contextTypes = {
    siderCollapsed: PropTypes.bool,
    collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
DynamicMenu = DynamicMenu_1 = __decorate([
    hot(module),
    observer
], DynamicMenu);
export { DynamicMenu };
