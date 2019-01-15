import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import React, { Fragment } from 'react';
import { LinkType } from './LinkType';
import { hot } from 'decorators';
import { Link, LinkProps } from 'react-router-dom';
import { app } from 'ioc';
import { clink } from 'stores/CLinkStore';


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
        if(!this.project || !this.revision) return <Fragment>{this.props.children}</Fragment>;
        const { children, link, route, to, icon, styling, ...rest } = this.props;

        let props: LinkProps = {
            ...rest,
            to       : app.routes.getRoute('documentation.revision').toPath({ project: this.project, revision: this.revision }),
            className: styling ? 'c-revision-link' : null,
        };
        return (
            <Link {...props}>
                {icon ? <i className="c-revision-icon"/> : null}
                {children || this.revision}
            </Link>
        );
    }
}


