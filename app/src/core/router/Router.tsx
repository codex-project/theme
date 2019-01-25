import React, { Component } from 'react';
import { Router as ReactRouter } from 'react-router';
import { History } from 'history';

export interface CodexRouterProps {
    history: History
}


export class Router extends Component<CodexRouterProps> {
    static displayName                             = 'CodexRouter';
    static defaultProps: Partial<CodexRouterProps> = {};

    routerRef: ReactRouter;

    render() {
        const { children, ...props } = this.props;
        return (
            <ReactRouter
                ref={ref => this.routerRef = ref}
                history={this.props.history}
            >
                {children}
            </ReactRouter>
        );
    }
}

