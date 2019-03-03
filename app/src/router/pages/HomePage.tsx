import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

export interface HomePageProps {}

@hot(module)
export default class HomePage extends Component<HomePageProps> {
    static displayName                           = 'HomePage';
    static defaultProps: Partial<HomePageProps> = {};

    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                <h1>Home Page</h1>
                {children}
            </div>
        );
    }
}
