import React from 'react';

import { observer } from 'mobx-react';
import { Breadcrumb, Dropdown, Menu } from 'antd';
import { Icon } from '../icon';
import { classes } from 'typestyle';

import './index.scss';
import { hot } from 'react-hot-loader';
import { IStoreProxy, LayoutStorePart, Store } from 'stores';
import { lazyInject } from 'ioc';
import { RouteLink, Router } from 'router';
import { DynamicContent, isDynamicChildren } from 'components/dynamic-content';

export interface LayoutBreadcrumbsProps {
    className?: string
    style?: React.CSSProperties
    hideHome?: boolean
}

@hot(module)
@observer
export class LayoutBreadcrumbs extends React.Component<LayoutBreadcrumbsProps> {
    static displayName                                   = 'LayoutBreadcrumbs';
    static defaultProps: Partial<LayoutBreadcrumbsProps> = {};
    @lazyInject('store') store: Store;
    @lazyInject('router') router: Router;

    getChildren(part: LayoutStorePart<any> | IStoreProxy<LayoutStorePart<any>>) {
        const { codex, project, revision, document } = this.store;
        let iconStyle                                = { marginRight: 5 };
        if ( ! this.props.children && isDynamicChildren(part.children) ) {
            return <DynamicContent children={part.children}/>;
        }
        if ( this.props.children && isDynamicChildren(this.props.children) ) {
            return <DynamicContent children={this.props.children}/>;
        }
        if ( ! this.props.children ) {
            return [
                project && project.key && <Breadcrumb.Item key="project">
                    <Dropdown overlay={
                        <Menu>
                            {codex.projects.map((project, i) => {
                                let params = { project: project.key };
                                let title  = project.display_name || project.key;
                                return (
                                    <Menu.Item key={project.key || i}>
                                        <RouteLink name="documentation.project" params={params}>
                                            <Icon name="book" style={iconStyle}/> {title}
                                        </RouteLink>
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    }>
                        <a className="ant-dropdown-link" href="#"><Icon name="book" style={iconStyle}/> {project.display_name || project.key}</a>
                    </Dropdown>
                </Breadcrumb.Item>,

                revision && revision.key && <Breadcrumb.Item key="revision">
                    <Dropdown overlay={
                        <Menu>
                            <If condition={project.revisions}>
                                {project.revisions.map((revision, i) => {
                                    let params = { project: project.key, revision: revision.key };
                                    let title  = revision.key;
                                    return (
                                        <Menu.Item key={revision.key || i}>
                                            <RouteLink name="documentation.revision" params={params}>
                                                <Icon name="code-fork" style={iconStyle}/> {title}
                                            </RouteLink>
                                        </Menu.Item>
                                    );
                                })}
                            </If>
                        </Menu>
                    }>
                        <a className="ant-dropdown-link" href="#"><Icon name="code-fork" style={iconStyle}/> {revision.key}</a>
                    </Dropdown>
                </Breadcrumb.Item>,

                document && document.key && <Breadcrumb.Item key="document">
                    <Icon name="file-text-o" style={iconStyle}/> {document.title || document.subtitle || document.key}
                </Breadcrumb.Item>,
            ].filter(Boolean);
        }
        return this.props.children;
    }

    render() {
        const { style, className, hideHome, children, ...props } = this.props;
        const { codex, project, revision, document }             = this.store;
        let iconStyle                                            = { marginRight: 5 };
        let classNames                                           = (name: string, ...names) => classes(`c-layout-${name}`, ...names);
        return (
            <Breadcrumb
                className={classNames('breadcrumb', className)}
                separator=">"
                style={style}
                {...props}
            >
                <If condition={! hideHome}>
                    <Breadcrumb.Item>
                        <RouteLink name="home" title="Home">
                            <Icon name="home"/>
                        </RouteLink>
                    </Breadcrumb.Item>
                </If>

                {this.getChildren(this.store.layout.toolbar.breadcrumbs)}
            </Breadcrumb>
        );
    }

}

