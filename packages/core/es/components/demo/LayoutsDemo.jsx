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
import { Fragment } from 'react';
import { Layout as AntdLayout } from 'antd';
import { hot } from '../../decorators';
import { colors } from '../../utils/colors';
import { color as getColor } from 'csx';
import { lazyInject } from '../../ioc';
import { Store } from '../../stores';
import { observer } from 'mobx-react';
const log = require('debug')('components:demo:layouts');
const getLayout = (colorKey, defaultProps = {}) => {
    ['layout', 'header', 'sider', 'content', 'footer'].forEach(key => defaultProps[key] = defaultProps[key] || {});
    let hex = colors[colorKey].toUpperCase();
    let color = getColor(hex).toRGBA();
    let bg = (fade = Math.random()) => ({ backgroundColor: color.fade(fade).toString() });
    const Layout = (props) => <AntdLayout style={bg(.0)} {...defaultProps.layout} {...props}/>;
    const Header = (props) => <AntdLayout.Header style={bg(.1)} {...defaultProps.header} {...props}/>;
    const Sider = (props) => <AntdLayout.Sider style={bg(.3)} {...defaultProps.sider} {...props}/>;
    const Content = (props) => <AntdLayout.Content style={bg(.2)} {...defaultProps.content} {...props}/>;
    const Footer = (props) => <AntdLayout.Footer style={bg(.1)} {...defaultProps.footer} {...props}/>;
    return { Layout, Header, Sider, Content, Footer };
};
let LayoutsDemo = class LayoutsDemo extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { layout: 'default' };
    }
    render() {
        if (!this.state || !this.state.layout)
            return null;
        const { left } = this.store.layout;
        const { Footer, Content, Sider, Header, Layout } = getLayout('red-10', {
            content: { style: { height: 'calc(70vh)' } },
        });
        const layouts = {
            'default': <Layout>
                    <Layout>
                        <Header>Header</Header>
                        <Content>Content</Content>
                        <Footer>Footer</Footer>
                    </Layout>
                </Layout>,
            'sider left inside': <Layout>
                    <Header>Header</Header>
                    <Layout>
                        <Sider>Sider</Sider>
                        <Content>Content</Content>
                    </Layout>
                    <Footer>Footer</Footer>
                </Layout>,
            'sider right inside': <Layout>
                    <Header>Header</Header>
                    <Layout>
                        <Content>Content</Content>
                        <Sider>Sider</Sider>
                    </Layout>
                    <Footer>Footer</Footer>
                </Layout>,
            'sider left outside': <Layout>
                    <Sider>Sider</Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content>Content</Content>
                        <Footer>Footer</Footer>
                    </Layout>
                </Layout>,
            'sider left outside right inside': <Layout>
                    <Sider>Sider</Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Layout>
                            <Content>Content</Content>
                            <Sider>Sider</Sider>
                        </Layout>
                        <Footer>Footer</Footer>
                    </Layout>
                </Layout>,
            'sider left outside+inside right inside+outside': <Layout>
                    <Sider>Sider</Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Layout>
                            <Sider>Sider</Sider>
                            <Content>Content</Content>
                            <Sider>Sider</Sider>
                        </Layout>
                        <Footer>Footer</Footer>
                    </Layout>
                    <Sider>Sider</Sider>
                </Layout>,
        };
        let layoutkeys = Object.keys(layouts);
        let switcher = (<div style={{ position: 'fixed', top: 0, right: 0 }}>
                {layoutkeys.map(key => <button key={key} onClick={e => this.setState({ layout: key })}>{key}</button>)}
            </div>);
        let storeViewer = <div style={{ position: 'fixed', bottom: 0, right: 0, maxHeight: 100, overflowY: 'scroll' }}>
                    <pre>
                        <code>
                        width: {left.width}<br />
                        collapsedWidth: {left.collapsedWidth}<br />
                        collapsed: {left.collapsed ? 'true' : 'false'}<br />
                        hide: {left.hide ? 'true' : 'false'}<br />
                        </code>
                    </pre>
                </div>;
        return <Fragment>{switcher}{layouts[this.state.layout]}{storeViewer}</Fragment>;
    }
};
LayoutsDemo.displayName = 'LayoutsDemo';
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], LayoutsDemo.prototype, "store", void 0);
LayoutsDemo = __decorate([
    hot(module),
    observer
], LayoutsDemo);
export { LayoutsDemo };
