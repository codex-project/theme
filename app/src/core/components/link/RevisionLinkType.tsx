import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import React, { Fragment } from 'react';
import { LinkType } from './LinkType';

import { hot } from 'decorators';
import { clink } from 'stores';
import { app } from 'ioc';
import { LinkProps } from 'react-router-dom';
import { RouteLink } from 'router';


@hot(module)
@observer
@clink.type('revision')
export class RevisionLinkType extends LinkType {

    @observable project: string;
    @observable revision: string;

    @action updateRouteParams() {
        let { project, revision } = this.getRouteParams();
        this.project              = project;
        this.revision             = revision;
    }

    render() {
        if ( ! this.project || ! this.revision ) return <Fragment>{this.props.children}</Fragment>;
        const { children, link, match, to, icon, styling, ...rest } = this.props;

        let props: LinkProps = {
            ...rest,
            to       : app.routes.toUrl({ name: 'documentation.revision', params: { project: this.project, revision: this.revision } }),
            className: styling ? 'c-revision-link' : null,
        };
        return (
            <RouteLink {...props}>
                {icon ? <i className="c-revision-icon"/> : null}
                {children || this.revision}
            </RouteLink>
        );
    }
}


