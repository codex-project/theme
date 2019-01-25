import React from 'react';
import { RouteDefinition } from 'router';
import { app } from 'ioc';

export interface LinkTypeProps {
    link?: React.ReactNode
    route?: RouteDefinition
    to?: string
    styling?: boolean
    icon?: boolean
}


export abstract class LinkType<P extends LinkTypeProps = LinkTypeProps, S = {}> extends React.Component<P, S> {
    static defaultProps: Partial<LinkTypeProps> = {
        styling: true,
        icon   : true,
    };

    public componentDidMount(): void {
        this.updateRouteParams();
    }

    abstract updateRouteParams()

    getRouteParams() { return app.routes.getRouteParams(this.props.route, this.props.to); }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: any): void {
        if ( this.props.to !== prevProps.to ) {
            this.updateRouteParams();
        }
    }
}


