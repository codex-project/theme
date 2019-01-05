var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
import React from 'react';
import { LayoutStore } from 'stores/store.layout';
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { Layout as AntdLayout } from 'antd';
import { StoreControl } from 'components/StoreControl';
import { lazyInject } from 'ioc';
import { LayoutHeader } from 'components/layout/LayoutHeader';
import './layout.mscss';
import './index.scss';
import { LayoutSide } from 'components/layout/LayoutSide';
import { LayoutFooter } from 'components/layout/LayoutFooter';
const { Sider, Header, Content, Footer } = AntdLayout;
let Layout = class Layout extends React.Component {
    render() {
        window['layout'] = this;
        const _a = this.props, { children } = _a, props = __rest(_a, ["children"]);
        const { container, header, left, middle, content, right, footer } = this.layout;
        return (<AntdLayout style={container.computedStyle}>
                <If condition={left.show && left.outside}>
                    <LayoutSide side='left'>{props.left}</LayoutSide>
                </If>
                <AntdLayout>
                    <If condition={header.show}>
                        <LayoutHeader>{props.header}</LayoutHeader>
                    </If>

                    <AntdLayout style={middle.computedStyle} className={middle.computedClass}>
                        <If condition={left.show && !left.outside}>
                            <LayoutSide side='left'>{props.left}</LayoutSide>
                        </If>

                        <Content style={content.computedStyle} className={content.computedClass}>
                            {children || props.content || null}
                        </Content>

                        <If condition={right.show && !right.outside}>
                            <LayoutSide side='right'/>
                        </If>
                    </AntdLayout>

                    <If condition={footer.show}>
                        <LayoutFooter>{props.footer}</LayoutFooter>
                    </If>
                </AntdLayout>
                <If condition={right.show && right.outside}>
                    <LayoutSide side='right'/>
                </If>


                {this.renderStoreController()}
            </AntdLayout>);
    }
    renderStoreController() {
        return (<StoreControl store={this.layout} stores={{
            'container': {
                stretch: 'boolean',
            },
            'header': {
                show: 'boolean',
                height: 'number',
                fixed: 'boolean',
                color: 'color.name',
                logo: 'boolean',
                menu: 'menu',
            },
            'left': {
                show: 'boolean',
                width: 'number',
                collapsedWidth: 'number',
                collapsed: 'boolean',
                outside: 'boolean',
                color: 'color.name',
                menu: 'menu',
            },
            'right': {
                show: 'boolean',
                width: 'number',
                collapsedWidth: 'number',
                collapsed: 'boolean',
                outside: 'boolean',
                color: 'color.name',
            },
            'middle': {
                padding: 'string',
                margin: 'string',
                color: 'color.name',
            },
            'content': {
                padding: 'string',
                margin: 'string',
                color: 'color.name',
            },
            'footer': {
                show: 'boolean',
                height: 'number',
                fixed: 'boolean',
                color: 'color.name',
            },
        }}/>);
    }
};
Layout.displayName = 'Layout';
Layout.defaultProps = {
    left: null,
    right: null,
    header: null,
    footer: null,
    content: null,
};
Layout.Header = LayoutHeader;
Layout.Footer = LayoutFooter;
Layout.Side = LayoutSide;
__decorate([
    lazyInject('store.layout'),
    __metadata("design:type", LayoutStore)
], Layout.prototype, "layout", void 0);
Layout = __decorate([
    hot(module),
    observer
], Layout);
export { Layout };
