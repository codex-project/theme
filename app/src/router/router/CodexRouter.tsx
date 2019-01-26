import React, { Component } from 'react';
// noinspection ES6UnusedImports
import { Router } from 'react-router';
// noinspection ES6UnusedImports
import { BrowserRouter, generatePath, matchPath, withRouter } from 'react-router-dom';
import createBrowserHistory, { BrowserHistoryBuildOptions } from 'history/createBrowserHistory';
import { History } from 'history';

export interface CodexRouterProps {}


export class CodexRouter extends Component<CodexRouterProps & BrowserHistoryBuildOptions> {
    static displayName                             = 'CodexRouter';
    static defaultProps: Partial<CodexRouterProps> = {};

    history: History;
    routerRef: Router;

    render() {
        const { children, ...props } = this.props;
        if ( ! this.history ) {
            this.history = createBrowserHistory(props);
        }
        return (
            <Router
                ref={ref => this.routerRef = ref}
                history={this.history}
            >
                {children}
            </Router>
        );
    }
}

export default CodexRouter;
