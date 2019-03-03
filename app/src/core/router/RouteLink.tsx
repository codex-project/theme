import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from 'ioc';
import { Router } from './Router';
import { getElementType } from 'utils/getElementType';

export interface RouteLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    as?: React.ReactType
    to: string | { name: string, params?: any }
    push?: boolean
    replace?: boolean
    go?: number
}

@hot(module)
export class RouteLink extends Component<RouteLinkProps> {
    static displayName                           = 'RouteLink';
    static defaultProps: Partial<RouteLinkProps> = {
        as: 'a',
    };

    @lazyInject('router') router: Router;

    handleClick = (event) => {
        event.preventDefault();
        let { to, push, replace, go } = this.props;
        if ( typeof go === 'number' ) {
            this.router.go(go);
            return;
        }
        let match = this.router.matchPath(this.router.toUrl(to));
        this.router.navigate(match.name, match.params, { push, replace });
    };

    getUrl() {
        return this.router.toUrl(this.props.to);
    }

    render() {
        const { children, as, to, ...props } = this.props;
        const ElementType                    = getElementType(RouteLink, this.props) as any;

        return (
            <ElementType
                href={this.getUrl()}
                onClick={e => this.handleClick(e)}
                {...props}
            >
                {children}
            </ElementType>
        );
    }
}

