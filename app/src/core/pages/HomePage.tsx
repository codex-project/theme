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
                <dl>
                    {Object.keys(data).map(key => [
                        <dt key={'key.' + key}>data.{key}:</dt>,
                        <dd key={'value.' + key}>{data[ key ]}</dd>,
                    ])}
                </dl>
            </div>
        );
    }
}
