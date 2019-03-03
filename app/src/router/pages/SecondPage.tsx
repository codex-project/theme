import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

export interface SecondPageProps {}

@hot(module)
export default class SecondPage extends Component<SecondPageProps> {
    static displayName                           = 'SecondPage';
    static defaultProps: Partial<SecondPageProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                <h1>Second Page</h1>
                {children}
            </div>
        );
    }
}
