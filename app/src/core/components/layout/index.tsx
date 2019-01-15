import React from 'react';
import { LayoutStore } from '../../stores/store.layout';
import { hot } from '../../decorators';
import { observer } from 'mobx-react';
import { Breadcrumb, Dropdown, Layout as AntdLayout, Menu } from 'antd';
import { lazyInject } from '../../ioc';
import { LayoutHeader } from '../../components/layout/LayoutHeader';
import { LayoutSide } from '../../components/layout/LayoutSide';
import { LayoutFooter } from '../../components/layout/LayoutFooter';
import './index.scss';
import { Link } from 'react-router-dom';
import { Store } from 'stores';
import { Icon } from 'components/Icon';
import { Routes } from 'collections/Routes';
import { classes } from 'typestyle';


const { Sider, Header, Content, Footer } = AntdLayout;

interface LayoutState {}

export interface LayProps {
    left?: React.ReactNode
    right?: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    content?: React.ReactNode
}

@hot(module)
@observer
export class Layout extends React.Component<LayProps, LayoutState> {
    static displayName                     = 'Layout';
    static defaultProps: Partial<LayProps> = {
        left   : null,
        right  : null,
        header : null,
        footer : null,
        content: null,
    };
    static Header: typeof LayoutHeader     = LayoutHeader;
    static Footer: typeof LayoutFooter     = LayoutFooter;
    static Side: typeof LayoutSide         = LayoutSide;

    @lazyInject('store.layout') layout: LayoutStore;
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: Routes;

    renderBreadcrumbs() {
        const { container, header, left, middle, content, right, footer } = this.layout;
        const { codex, project, revision, document }                      = this.store;
        let iconStyle                                                     = { marginRight: 5 };
        let className                                                     = (name: string, ...names) => classes(`c-layout-${name}`, ...names);
        return (
            <Breadcrumb
                className={className('breadcrumb')}
                separator=">"
                style={{
                    // marginTop      : content.computedStyle.marginTop,
                    // marginLeft     : content.computedStyle.marginLeft,
                    // marginRight    : content.computedStyle.marginRight,
                    backgroundColor: content.computedStyle.backgroundColor,
                    // padding        : '5px 24px',
                    padding        : '5px 40px',
                }}
            >
                <Breadcrumb.Item>
                    <Link to={this.routes.getRoute('home').toPath()} title="Home">
                        <Icon name="home"/>
                    </Link>
                </Breadcrumb.Item>

                <If condition={project && project.key}>
                    <Breadcrumb.Item>
                        <Dropdown overlay={
                            <Menu>
                                {codex.projects.map((project, i) => {
                                    let route = this.routes.getRoute('documentation.project');
                                    let to    = route.toPath({ project: project.key });
                                    let title = project.display_name || project.key;
                                    return <Menu.Item key={project.key || i}><Link to={to}><Icon name="book" style={iconStyle}/> {title}</Link></Menu.Item>;
                                })}
                            </Menu>
                        }>
                            <a className="ant-dropdown-link" href="#"><Icon name="book" style={iconStyle}/> {project.display_name || project.key}</a>
                        </Dropdown>
                    </Breadcrumb.Item>
                </If>

                <If condition={revision && revision.key}>
                    <Breadcrumb.Item>
                        <Dropdown overlay={
                            <Menu>
                                <If condition={project.revisions}>
                                    {project.revisions.map((revision, i) => {
                                        let route = this.routes.getRoute('documentation.revision');
                                        let to    = route.toPath({ project: project.key, revision: revision.key });
                                        let title = revision.key;
                                        return <Menu.Item key={revision.key || i}><Link to={to}><Icon name="code-fork" style={iconStyle}/> {title}</Link></Menu.Item>;
                                    })}
                                </If>
                            </Menu>
                        }>
                            <a className="ant-dropdown-link" href="#"><Icon name="code-fork" style={iconStyle}/> {revision.key}</a>
                        </Dropdown>
                    </Breadcrumb.Item>
                </If>

                <If condition={document && document.key}>
                    <Breadcrumb.Item>
                        <Icon name="file-text-o" style={iconStyle}/> {document.title || document.subtitle || document.key}
                    </Breadcrumb.Item>
                </If>

            </Breadcrumb>
        );
    }

    ref = {
        header: React.createRef() as any,
        left  : React.createRef() as any,
        right : React.createRef() as any,
        footer: React.createRef() as any,
    };


    render() {
        window[ 'layout' ]                                                = this;
        const { children, ...props }                                      = this.props;
        const { container, header, left, middle, content, right, footer } = this.layout;
        return (
            <AntdLayout style={container.computedStyle}>
                <If condition={left.show && left.outside}>
                    <LayoutSide ref={this.ref.left} side='left'>{props.left}</LayoutSide>
                </If>
                <AntdLayout>
                    <If condition={header.show}>
                        <LayoutHeader ref={this.ref.header}>{props.header}</LayoutHeader>
                    </If>

                    <AntdLayout style={middle.computedStyle} className={middle.computedClass}>
                        <If condition={left.show && ! left.outside}>
                            <LayoutSide ref={this.ref.left} side='left'>{props.left}</LayoutSide>
                        </If>

                        <Content style={{ minHeight: '100%' }}>
                            {this.renderBreadcrumbs()}

                            <AntdLayout>
                                <Content style={content.computedStyle} className={content.computedClass}>
                                    {children || props.content || null}
                                </Content>
                            </AntdLayout>
                        </Content>
                        <If condition={right.show && ! right.outside}>
                            <LayoutSide ref={this.ref.right} side='right'/>
                        </If>
                    </AntdLayout>

                    <If condition={footer.show}>
                        <LayoutFooter ref={this.ref.footer}>{props.footer}</LayoutFooter>
                    </If>
                </AntdLayout>
                <If condition={right.show && right.outside}>
                    <LayoutSide ref={this.ref.right} side='right'/>
                </If>

            </AntdLayout>
        );
    }

    // renderStoreController() {
    //     return (
    //         <StoreControl store={this.layout} stores={{
    //             'container': {
    //                 stretch: 'boolean',
    //             },
    //             'header'   : {
    //                 show             : 'boolean',
    //                 height           : 'number',
    //                 fixed            : 'boolean',
    //                 color            : 'color.name',
    //                 logo             : 'boolean',
    //                 show_left_toggle : 'boolean',
    //                 show_right_toggle: 'boolean',
    //                 menu             : 'menu',
    //             },
    //             'left'     : {
    //                 show          : 'boolean',
    //                 width         : 'number',
    //                 collapsedWidth: 'number',
    //                 collapsed     : 'boolean',
    //                 outside       : 'boolean',
    //                 color         : 'color.name',
    //                 menu          : 'menu',
    //             },
    //             'right'    : {
    //                 show          : 'boolean',
    //                 width         : 'number',
    //                 collapsedWidth: 'number',
    //                 collapsed     : 'boolean',
    //                 outside       : 'boolean',
    //                 color         : 'color.name',
    //             },
    //             'middle'   : {
    //                 padding: 'string',
    //                 margin : 'string',
    //                 color  : 'color.name',
    //             },
    //             'content'  : {
    //                 padding: 'string',
    //                 margin : 'string',
    //                 color  : 'color.name',
    //             },
    //             'footer'   : {
    //                 show  : 'boolean',
    //                 height: 'number',
    //                 fixed : 'boolean',
    //                 color : 'color.name',
    //             },
    //         }}/>
    //     );
    // }
}
