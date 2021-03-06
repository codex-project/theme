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
@clink.type('document')
export class DocumentLinkType extends LinkType {

    @observable project: string;
    @observable revision: string;
    @observable document: string;

    @action updateRouteParams() {
        let { project, revision, document } = this.getRouteParams();
        this.project                        = project;
        this.revision                       = revision;
        this.document                       = document;
    }

    render() {
        if ( ! this.project || ! this.revision || ! this.document ) return <Fragment>{this.props.children}</Fragment>;
        const { children, link, match, to, icon, styling, ...rest } = this.props;

        let props: RouteLinkProps = {
            ...rest,
            to       : app.router.toUrl({
                name  : 'documentation.document',
                params: {
                    project : this.project,
                    revision: this.revision,
                    document: this.document,
                },
            }) as any,
            className: styling ? 'c-document-link' : null,
        };
        return (
            <RouteLink {...props}>
                {icon ? <i className="c-document-icon"/> : null}
                {children || this.document}
            </RouteLink>
        );
    }
}


