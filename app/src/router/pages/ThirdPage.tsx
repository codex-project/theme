import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

export interface ThirdPageProps {}

@hot(module)
export default class ThirdPage extends Component<ThirdPageProps> {
    static displayName                           = 'ThirdPage';
    static defaultProps: Partial<ThirdPageProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                <h1>Third Page</h1>
                {children}
            </div>
        );
    }
}
