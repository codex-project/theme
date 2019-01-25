import React, { Component } from 'react';
import { History } from './types';
import { RouteMap } from './RouteMap';
import { lazyInject } from 'ioc';


export interface RouteLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    name: string
    params?: any
    replace?: boolean
    to?: string
}


export class RouteLink extends Component<RouteLinkProps> {
    static displayName                           = 'Link';
    static defaultProps: Partial<RouteLinkProps> = {
        params : {},
        replace: false,
    };
    @lazyInject('routes') routes: RouteMap;
    @lazyInject('history') history: History;

    render() {
        const { children, name, params, replace, to, ...props } = this.props;
        let url                                                 = to ? to : this.routes.generatePath(name, params);
        return (
            <a
                href={url}
                onClick={this.onClick}
                {...props}>
                {children}
            </a>
        );
    }

    onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const { name, params, replace, to } = this.props;
        let url                             = to ? to : this.routes.generatePath(name, params);
        this.history.push(url);
    };
}

