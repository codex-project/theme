import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { Routes } from 'collections/Routes';
import { lazyInject } from 'ioc';
import { TunnelProvider } from 'components/tunnel';
import RootNode from 'components/RootNode';

const log = require('debug')('App5');

interface State {}

export interface AppProps {}


@observer
class App5 extends React.Component<AppProps, any> {
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: Routes;

    static displayName = 'App';

    render() {
        log('render', this.props);
        return (
            <TunnelProvider>
                <div>
                    <RootNode/>
                </div>
            </TunnelProvider>
        );
    }

}

export const App = hot(App5);
