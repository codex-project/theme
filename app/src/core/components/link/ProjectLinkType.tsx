import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import React, { Fragment } from 'react';
import { LinkType } from './LinkType';
import { LinkProps } from 'react-router-dom';

import { hot } from 'decorators';
import { clink } from 'stores';
import { app } from 'ioc';
import { RouteLink } from 'router';


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

        let props: LinkProps = {
            ...rest,
            to       : app.routes.get('documentation.project').toPath({ project: this.project }),
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


