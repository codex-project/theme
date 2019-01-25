import React, { Component } from 'react';
import { Params } from '../types';
import { lazyInject } from 'ioc';
import { Router } from 'router';

export interface RouteLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    name: string
    params?: Params
    replace?: boolean
}


export class RouteLink extends Component<RouteLinkProps> {
    static displayName                           = 'Link';
    static defaultProps: Partial<RouteLinkProps> = {
        params : {},
        replace: false,
    };
    @lazyInject('router') router: Router;

    render() {
        const { children, name, params, replace, ...props } = this.props;

        const route = this.router.getRoute(name);
        const url   = route.pattern.build(params);

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
        const { name, params, replace } = this.props;
        this.router.navigate(name, params, { replace: replace });
    };
}

