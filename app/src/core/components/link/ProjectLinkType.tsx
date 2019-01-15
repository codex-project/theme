import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import React, { Fragment } from 'react';
import { LinkType } from './LinkType';
import { Link, LinkProps } from 'react-router-dom';
import { hot } from 'decorators';
import { app } from 'ioc';
import { clink } from 'stores/CLinkStore';


@hot(module)
@observer
@clink.type('project')
export class ProjectLinkType extends LinkType {

    @observable project: string;

    @action updateRouteParams() {
        this.project = this.getRouteParams().project;
    }

    render() {
        if(!this.project) return <Fragment>{this.props.children}</Fragment>;
        const { children, link, route, to, icon, styling, ...rest } = this.props;

        let props: LinkProps = {
            ...rest,
            to       : app.routes.getRoute('documentation.project').toPath({ project: this.project }),
            className: styling ? 'c-project-link' : null,
        };
        return (
            <Link {...props}>
                {icon ? <i className="c-project-icon"/> : null}
                {children || this.project}
            </Link>
        );
    }
}


