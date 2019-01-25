import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import React, { Fragment } from 'react';
import { LinkType } from './LinkType';
import { Link, LinkProps } from 'react-router-dom';
import { hot } from 'decorators';
import { clink } from 'stores';
import { app } from 'ioc';

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
        const { children, link, route, to, icon, styling, ...rest } = this.props;

        let props: LinkProps = {
            ...rest,
            to       : app.routes.get('documentation.document').toPath({
                project : this.project,
                revision: this.revision,
                document: this.document,
            }),
            className: styling ? 'c-document-link' : null,
        };
        return (
            <Link {...props}>
                {icon ? <i className="c-document-icon"/> : null}
                {children || this.document}
            </Link>
        );
    }
}


