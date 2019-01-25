import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { TunnelProvider } from 'components/tunnel';
import Layout from 'components/layout';
import { Router } from 'router';
import { ErrorBoundary } from 'components/errors';
import { Helmet } from 'react-helmet';

const log = require('debug')('App5');

interface State {}

export interface AppProps {}


@observer
class AppComponent extends React.Component<AppProps, any> {
    @lazyInject('store') store: Store;
    @lazyInject('router') router: Router;

    static displayName = 'AppComponent';

    render() {
        return (
            <div>
                <h3>Layout Content</h3>
                <ul>
                    <li>pathname: {this.router.current.pathname}</li>
                    <li>key: {JSON.stringify(this.router.current.key)}</li>
                    <li>hash: {JSON.stringify(this.router.current.hash)}</li>
                    <li>state: {JSON.stringify(this.router.current.state, null, 4)}</li>
                </ul>
            </div>
        );
    }

    render2() {
        return (
            <ErrorBoundary>
                <TunnelProvider>
                    <Layout>
                        <Helmet
                            defaultTitle={this.store.codex.display_name}
                            titleTemplate={this.store.codex.display_name + ' - %s'}
                            {...this.store.helmet}
                        />
                        <ErrorBoundary>
                            <div>
                                <h3>Layout Content</h3>
                                <ul>
                                    <li>pathname: {this.router.current.pathname}</li>
                                    <li>key: {JSON.stringify(this.router.current.key)}</li>
                                    <li>hash: {JSON.stringify(this.router.current.hash)}</li>
                                    <li>state: {JSON.stringify(this.router.current.state, null, 4)}</li>
                                </ul>
                            </div>
                        </ErrorBoundary>
                    </Layout>
                </TunnelProvider>
            </ErrorBoundary>
        );
    }

}

export const App = hot(AppComponent);
