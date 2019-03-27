import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import React, { Fragment } from 'react';
import { LinkType } from './LinkType';

import { hot } from 'decorators';
import { clink } from 'stores';
import { app } from 'ioc';
import { RouteLink, RouteLinkProps } from 'router';


@hot(module)
@observer
@clink.type('project')
export class ProjectLinkType extends LinkType {

    @observable project: string;

    @action updateRouteParams() {
        this.project = this.getRouteParams().project;
    }

    render() {
        if ( ! this.project ) return <Fragment>{this.props.children}</Fragment>;
        const { children, link, match, to, icon, styling, ...rest } = this.props;

        let props: RouteLinkProps = {
            ...rest,
            to       : app.router.toUrl({ name: 'documentation.project', params: { project: this.project } }) as any,
            className: styling ? 'c-project-link' : null,
        };
        return (
            <RouteLink {...props}>
                {icon ? <i className="c-project-icon"/> : null}
                {children || this.project}
            </RouteLink>
        );
    }
}


