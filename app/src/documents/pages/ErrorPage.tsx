import React from 'react';
import { hot, lazyInject, RouteState, Store } from '@codex/core';

const log = require('debug')('pages:error');

export interface ErrorPageProps {
    title?: React.ReactNode
    message?: React.ReactNode
    error?: Error
    routeState: RouteState
}

@hot(module)
export default class ErrorPage extends React.Component<ErrorPageProps> {
    static displayName = 'ErrorPage';
    @lazyInject('store') store: Store;

    render() {
        log('render', { props: this.props }, this);
        let { error, title, message } = this.props;
        title                         = title || error.name;
        message                       = message || error.message;

        return (
            <div>
                <h2>{title}</h2>
                <div>{message}</div>
            </div>
        );
    }
}
