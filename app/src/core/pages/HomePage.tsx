import React from 'react';
import { State } from 'router';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { TestImport } from 'pages/test-import';

const log = require('debug')('pages:home');

export default class HomePage extends React.Component<{ routeState: State, data?: any }> {
    static displayName = 'HomePage';
    @lazyInject('store') store: Store;
    state              = { show: false };

    handleShow = e => {
        e.preventDefault();
        this.setState({ show: true });
    };


    render() {
        let { routeState, data, children } = this.props;
        data                               = data || {};
        return (
            <div>
                <h2>HomePage</h2>

                <If condition={this.state.show}>
                    <TestImport />
                </If>
                <If condition={! this.state.show}>
                    <a href="#" onClick={this.handleShow}>show</a>
                </If>

            </div>
        );
    }
}
