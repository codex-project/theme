import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

export interface FirstPageProps {}

@hot(module)
export default class FirstPage extends Component<FirstPageProps> {
    static displayName                           = 'FirstPage';
    static defaultProps: Partial<FirstPageProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                <h1>First Page</h1>
                {children}
            </div>
        );
    }
}
