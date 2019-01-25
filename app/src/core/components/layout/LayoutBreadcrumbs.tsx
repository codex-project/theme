import React from 'react';

import { observer } from 'mobx-react';
import { Breadcrumb, Dropdown, Menu } from 'antd';
import { Icon } from '../icon';
import { classes } from 'typestyle';

import './index.scss';
import { hot } from 'decorators';
import { Store } from 'stores';
import { lazyInject } from 'ioc';
import { RouteLink, RouteMap } from 'router';

export interface LayoutBreadcrumbsProps {
    className?: string
    style?: React.CSSProperties
}

@hot(module)
@observer
export class LayoutBreadcrumbs extends React.Component<LayoutBreadcrumbsProps> {
    static displayName                                   = 'LayoutBreadcrumbs';
    static defaultProps: Partial<LayoutBreadcrumbsProps> = {};
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: RouteMap;

    render() {
        const { style, className, ...props }         = this.props;
        const { codex, project, revision, document } = this.store;
        let iconStyle                                = { marginRight: 5 };
        let classNames                               = (name: string, ...names) => classes(`c-layout-${name}`, ...names);
        return (
            <Breadcrumb
                className={classNames('breadcrumb', className)}
                separator=">"
                style={style}
                {...props}
            >
                <Breadcrumb.Item>
                    <RouteLink name="home" title="Home">
                        <Icon name="home"/>
                    </RouteLink>
                </Breadcrumb.Item>

                <If condition={project && project.key}>
                    <Breadcrumb.Item>
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
                    </Breadcrumb.Item>
                </If>

                <If condition={revision && revision.key}>
                    <Breadcrumb.Item>
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

export default LayoutBreadcrumbs;
