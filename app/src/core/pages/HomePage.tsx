import * as React from 'react';
import { hot } from 'decorators';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { RouteContext } from 'react-router5/types/types';

const log = require('debug')('pages:home');
@hot(module)
export default class HomePage extends React.Component<RouteContext & {data:any}> {
    static displayName = 'HomePage';
    @lazyInject('store') store: Store;

    render() {
        let { route, data, children } = this.props;
        data                    = data || {};
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
