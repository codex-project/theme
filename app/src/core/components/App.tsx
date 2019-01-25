import React from 'react';
import { hot } from 'react-hot-loader/root';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Store } from 'stores';
import { lazyInject } from 'ioc';
import { ErrorBoundary } from 'components/errors';
import { TunnelProvider } from 'components/tunnel';
import Layout from 'components/layout';
import { History } from 'router';

const log = require('debug')('App5');

interface State {}

export interface AppProps {}


@observer
class AppComponent extends React.Component<AppProps, any> {
    @lazyInject('store') store: Store;
    @lazyInject('history') history: History;

    static displayName = 'AppComponent';

    // render() {
    //     return (
    //         <div>
    //             <h3>Layout Content</h3>
    //             <ul>
    //                 <li>pathname: {this.history.location.pathname}</li>
    //                 <li>key: {JSON.stringify(this.history.location.key)}</li>
    //                 <li>hash: {JSON.stringify(this.history.location.hash)}</li>
    //                 <li>state: {JSON.stringify(this.history.location.state, null, 4)}</li>
    //             </ul>
    //         </div>
    //     );
    // }

    render() {
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
                                    <li>pathname: {this.history.location.pathname}</li>
                                    <li>key: {JSON.stringify(this.history.location.key)}</li>
                                    <li>hash: {JSON.stringify(this.history.location.hash)}</li>
                                    <li>state: {JSON.stringify(this.history.location.state, null, 4)}</li>
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
