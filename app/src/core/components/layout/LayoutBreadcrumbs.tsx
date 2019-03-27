import React, { Fragment } from 'react';

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
    hide?: {
        home?: boolean
        project?: boolean
        revision?: boolean
        document?: boolean
    }
}

// @todo: dynamic content breadcumb items
let FragmentBreadcrumb                       = (props) => <Fragment>{props.children}</Fragment>;
// FragmentBreadcrumb.type.__ANT_BREADCRUMB_ITEM       = true;
const DynamicContentBreadcrumb                 = DynamicContent;
// DynamicContentBreadcrumb.__ANT_BREADCRUMB_ITEM = true;


@hot(module)
@observer
export class LayoutBreadcrumbs extends React.Component<LayoutBreadcrumbsProps> {
    static displayName                                   = 'LayoutBreadcrumbs';
    static defaultProps: Partial<LayoutBreadcrumbsProps> = {
        hide: {},
    };
    @lazyInject('store') store: Store;
    @lazyInject('router') router: Router;

    getChildren(part: LayoutStorePart<any> | IStoreProxy<LayoutStorePart<any>>) {
        const { hide }                               = this.props;
        const { codex, project, revision, document } = this.store;
        let iconStyle                                = { marginRight: 5 };
        if ( ! this.props.children && isDynamicChildren(part.children) ) {
            return <DynamicContentBreadcrumb children={part.children}/>;
        }
        if ( this.props.children && isDynamicChildren(this.props.children) ) {
            return <DynamicContentBreadcrumb children={this.props.children}/>;
        }
        if ( ! this.props.children ) {
            return (
                <FragmentBreadcrumb>

                    <If condition={! hide.home}>
                        <Breadcrumb.Item>
                            <RouteLink name="home" title="Home">
                                <Icon name="home"/>
                            </RouteLink>
                        </Breadcrumb.Item>
                    </If>

                    <If condition={! hide.project && project && project.key}>
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

                    <If condition={! hide.revision && revision && revision.key}>
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

                    <If condition={! hide.document && document && document.key}>
                        <Breadcrumb.Item>
                            <Icon name="file-text-o" style={iconStyle}/> {document.title || document.subtitle || document.key}
                        </Breadcrumb.Item>
                    </If>


                </FragmentBreadcrumb>
            );
        }
        return this.props.children;
    }

    render() {
        const { style, className, hide, children, ...props } = this.props;
        const { codex, project, revision, document }         = this.store;
        let iconStyle                                        = { marginRight: 5 };
        let classNames                                       = (name: string, ...names) => classes(`c-layout-${name}`, ...names);
        return (
            <Breadcrumb
                className={classNames('breadcrumb', className)}
                separator=">"
                style={style}
                {...props}
            >

                <If condition={! hide.home}>
                    <Breadcrumb.Item>
                        <RouteLink name="home" title="Home">
                            <Icon name="home"/>
                        </RouteLink>
                    </Breadcrumb.Item>
                </If>

                <If condition={! hide.project && project && project.key}>
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

                <If condition={! hide.revision && revision && revision.key}>
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

                <If condition={! hide.document && document && document.key}>
                    <Breadcrumb.Item>
                        <Icon name="file-text-o" style={iconStyle}/> {document.title || document.subtitle || document.key}
                    </Breadcrumb.Item>
                </If>

            </Breadcrumb>
        );
    }

}

