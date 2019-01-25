import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { RouteState } from './routes';

const log = require('debug')('router:HomePage');

export interface HomePageProps {
    routeState: RouteState
    home?:string
}

export class HomePage extends Component<HomePageProps & RouteComponentProps> {
    static displayName                          = 'HomePage';
    static defaultProps: Partial<HomePageProps> = {};

    render() {
        const { children,home, ...props } = this.props;
        log('render', this);
        return (
            <div>
                <h2>HomePage</h2>
                <p>home: {home}</p>
                {children}
            </div>
        );
    }
}

export default HomePage;
