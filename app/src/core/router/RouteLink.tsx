import React, { Component } from 'react';
import { History } from './types';
import { RouteMap } from './RouteMap';
import { lazyInject } from 'ioc';


export interface RouteLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    name?: string
    params?: any
    replace?: boolean
    to?: any
}


export class RouteLink extends Component<RouteLinkProps> {
    static displayName                           = 'RouteLink';
    static defaultProps: Partial<RouteLinkProps> = {
        params : {},
        replace: false,
    };
    @lazyInject('routes') routes: RouteMap;
    @lazyInject('history') history: History;

    getUrl() {
        const { children, name, params, replace, to, ...props } = this.props;
        if ( to ) {
            return this.routes.toUrl(to);
        } else if ( name ) {
            return this.routes.generatePath(name, params);
        }
        return null;
    }

    render() {
        const { children, name, params, replace, to, ...props } = this.props;
        return (
            <a
                href={this.getUrl()}
                onClick={this.onClick}
                {...props}>
                {children}
            </a>
        );
    }

    onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        let url = this.getUrl();
        if ( this.props.replace ) {
            this.history.replace(url);
        } else {
            this.history.push(url);
        }
    };
}

