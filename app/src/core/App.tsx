import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { TunnelProvider } from 'components/tunnel';
import RootNode from 'routing/nodes/RootNode';
import Layout from 'components/layout';

const log = require('debug')('App5');

interface State {}

export interface AppProps {}


@observer
class AppComponent extends React.Component<AppProps, any> {
    @lazyInject('store') store: Store;

    static displayName = 'AppComponent';

    render() {
        log('render', this.props);
        return (

            <RootNode/>
        );
    }

}

export const App = hot(AppComponent);
