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
import { Layout, Menu as AntdMenu, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import './layout.mscss';
import { getColor } from 'utils/colors';
import { DynamicMenu } from 'components/dynamic-menu';
const { Header } = Layout;
const log = require('debug')('components:layout:header');
let LayoutHeader = class LayoutHeader extends React.Component {
    render() {
        let { children } = this.props;
        let { left, middle, header, right } = this.store.layout;
        let { computedStyle, computedClass, menu } = header;
        const devLinks = [
            '/',
            '/about',
            '/documentation',
            '/documentation/codex',
            '/documentation/codex/master',
            '/documentation/codex/master/index',
            '/documentation/codex/master/getting-started/installation',
        ];
        let toggleTooltip = {
            left: `Click to ${left.collapsed ? 'open' : 'close'} the left menu`,
            right: `Click to ${right.collapsed ? 'open' : 'close'} the right menu`,
        };
        let toggleClassName = {
            left: left.collapsed ? 'indent' : 'outdent',
            right: left.collapsed ? 'outdent' : 'indent',
        };
        return (<Header styleName="header" style={computedStyle} className={computedClass}>
                <If condition={header.logo}>
                    <div styleName="header-logo" style={{ width: left.width }}/>
                </If>
                <If condition={header.show_left_toggle}>
                    <Tooltip placement="right" title={toggleTooltip.left}>
                        <i className={'fa fa-' + toggleClassName.left} styleName="header-toggle" onClick={() => left.setCollapsed(!left.collapsed)}/>
                    </Tooltip>
                </If>
                <DynamicMenu theme="dark" mode="horizontal" styleName="header-menu" color={header.color} items={menu} renderer="header"/>
                <div style={{ flexGrow: 10 }}/>
                <AntdMenu theme="dark" mode="horizontal" styleName="header-menu" style={{ backgroundColor: getColor(header.color) }} selectedKeys={[]}>
                    <AntdMenu.SubMenu title="DevLinks" style={{ backgroundColor: getColor(header.color) }}>
                        {devLinks.map(link => <AntdMenu.Item style={{ backgroundColor: getColor(header.color), margin: 0 }} key={link}><NavLink to={link}>{link}</NavLink></AntdMenu.Item>)}
                    </AntdMenu.SubMenu>
                </AntdMenu>
                <If condition={header.show_right_toggle}>
                    <Tooltip placement="left" title={toggleTooltip.right}>
                        <i className={'fa fa-' + toggleClassName.right} styleName="header-toggle" onClick={() => right.setCollapsed(!right.collapsed)}/>
                    </Tooltip>
                </If>
            </Header>);
    }
};
LayoutHeader.displayName = 'LayoutHeader';
LayoutHeader.defaultProps = {};
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], LayoutHeader.prototype, "store", void 0);
LayoutHeader = __decorate([
    hot(module),
    observer
], LayoutHeader);
export { LayoutHeader };
