import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { RouteState } from '../router/types';

const log = require('debug')('router:ErrorPage');

export interface ErrorPageProps {
    routeState: RouteState
    title: React.ReactNode
    message: React.ReactNode
}

export class ErrorPage extends Component<ErrorPageProps & RouteComponentProps> {
    static displayName                           = 'ErrorPage';
    static defaultProps: Partial<ErrorPageProps> = {
        title  : 'An Error Occurred',
        message: 'Something went terribly wrong and now you are stuck here, forever..',
    };

    render() {
        const { children, title, message, ...props } = this.props;
        log('render', this);
        return (
            <div>
                <h2>{title}</h2>
                {message}
            </div>
        );
    }
}

export default ErrorPage;
