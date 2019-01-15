import React from 'react';
import { app } from 'ioc';
import { IDefinedRoute } from 'interfaces';

export interface LinkTypeProps {
    link?: React.ReactNode
    route?: IDefinedRoute
    to?: string
    styling?: boolean
    icon?: boolean
}


export abstract class LinkType<P extends LinkTypeProps = LinkTypeProps, S = {}> extends React.Component<P, S> {
    static defaultProps: Partial<LinkTypeProps> = {
        styling: true,
        icon   : true,
    };

    // constructor(props: P, context: any) {
    //     super(props, context);
    // }

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


