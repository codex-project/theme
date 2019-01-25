import React, { Component } from 'react';
import { observer } from 'mobx-react';

const log = require('debug')('router:HomePage');

export interface HomePageProps {}

@observer
export class HomePage extends Component<HomePageProps> {
    static displayName                          = 'HomePage';
    static defaultProps: Partial<HomePageProps> = {};

    render() {
        const { children, ...props } = this.props;
        log('render', this);
        return (
            <div>
                <h2>HomePage</h2>
                {children}
            </div>
        );
    }
}

export default HomePage;
