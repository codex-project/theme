import React from 'react';
import { app } from 'ioc';
import { match } from 'react-router';

export interface LinkTypeProps {
    link?: React.ReactNode
    match?: match<any>
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

    getRouteParams() { return this.props.match.params; }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: any): void {
        if ( this.props.to !== prevProps.to ) {
            this.updateRouteParams();
        }
    }
}


