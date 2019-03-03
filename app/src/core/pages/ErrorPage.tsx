import React from 'react';
import { State } from '../router';
import { lazyInject } from 'ioc';
import { Store } from 'stores';

const log = require('debug')('pages:error');

export interface ErrorPageProps {
    title?: React.ReactNode
    message?: React.ReactNode
    error?: Error
    routeState: State
}

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
