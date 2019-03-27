import React from 'react';
import { State } from 'router';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { hot } from 'react-hot-loader';

const log = require('debug')('pages:home');

@hot(module)
export class TestPage extends React.Component<{ routeState: State, data?: any }> {
    static displayName = 'TestPage';
    @lazyInject('store') store: Store;

    render() {
        let { routeState, data, children } = this.props;
        data                               = data || {};
        return (
            <div>
                <h2>TestPage</h2>
                <h4>Panes</h4>
            </div>
        );
    }
}
