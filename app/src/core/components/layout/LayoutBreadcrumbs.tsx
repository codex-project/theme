import React from 'react';
import { LayoutStore } from '../../stores/store.layout';
import { hot } from '../../decorators';
import { observer } from 'mobx-react';
import { Breadcrumb, Dropdown, Layout as AntdLayout, Menu } from 'antd';
import { lazyInject } from '../../ioc';
import './index.scss';
import { Link } from 'react-router-dom';
import { Store } from 'stores';
import { Icon } from 'components/Icon';
import { Routes } from 'collections/Routes';
import { classes } from 'typestyle';


const { Sider, Header, Content, Footer } = AntdLayout;


export interface LayoutBreadcrumbsProps {
    className?: string
    style?: React.CSSProperties
}

@hot(module)
@observer
export class LayoutBreadcrumbs extends React.Component<LayoutBreadcrumbsProps> {
    static displayName                                   = 'LayoutBreadcrumbs';
    static defaultProps: Partial<LayoutBreadcrumbsProps> = {};
    @lazyInject('store.layout') layout: LayoutStore;
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: Routes;

    render() {
        const { style, className, ...props }                              = this.props;
        const { container, header, left, middle, content, right, footer } = this.layout;
        const { codex, project, revision, document }                      = this.store;
        let iconStyle                                                     = { marginRight: 5 };
        let classNames                                                    = (name: string, ...names) => classes(`c-layout-${name}`, ...names);
        return (
            <Breadcrumb
                className={classNames('breadcrumb', className)}
                separator=">"
                style={style}
                {...props}
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

}
