import React from 'react';
import { State } from 'router';
import { lazyInject } from 'ioc';
import { Store } from 'stores';

const log = require('debug')('pages:home');

export default class HomePage extends React.Component<{ routeState: State, data?: any }> {
    static displayName = 'HomePage';
    @lazyInject('store') store: Store;


    render() {
        let { routeState, data, children } = this.props;
        data                               = data || {};
        return (
            <div>
                <h2>HomePage</h2>

            </div>
        );
    }
}
