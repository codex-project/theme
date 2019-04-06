import React from 'react';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { hot } from 'react-hot-loader';
import { LayoutFooter, LayoutHeader } from 'components/layout';

const log = require('debug')('pages:home');

@hot(module)
export class TestPage extends React.Component<any> {
    static displayName = 'TestPage';
    @lazyInject('store') store: Store;

    render() {
        return (
            <div>
                <LayoutHeader/>
                <div style={{ height: '99vh'}}>content</div>
                <LayoutFooter />
            </div>
        );
    }
}
