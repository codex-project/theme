import React from 'react';
import { Match, Router } from 'router';
import { lazyInject } from 'ioc';

export interface LinkTypeProps {
    link?: React.ReactNode
    match?: Match<any>
    to?: string
    styling?: boolean
    icon?: boolean
}


export abstract class LinkType<P extends LinkTypeProps = LinkTypeProps> extends React.Component<P> {
    @lazyInject('router') router: Router;
    static defaultProps: Partial<LinkTypeProps> = {
        styling: true,
        icon   : true,
    };

    // state: { state?: State } = { state: null };

    public componentDidMount(): void {
        this.updateRouteParams();
    }

    abstract updateRouteParams()

    getRouteParams(): any {
        return (this.props.match ? this.props.match : this.router.matchPath(this.props.to)).params;
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: any, snapshot?: any): void {
        if ( this.props.to !== prevProps.to ) {
            this.updateRouteParams();
        }
    }
}


