import * as React from 'react';
import PropTypes from 'prop-types';
import { hot, WithRouter, WithRouterProps } from '../decorators';
import { BrowserRouter, Router } from 'react-router-dom';
import { Store } from '../stores';
import { observer } from 'mobx-react';
import { Routes } from '../collections/Routes';
import { app, lazyInject } from '../ioc';
import { Helmet } from 'react-helmet';
import { ErrorBoundary } from './errors';
import { RouterPages } from './router-pages';

import '../styling/semantic.less';
import '../styling/stylesheet.scss';
// import styles from './App.mscss'
// import './App.mscss'
// noinspection ES6UnusedImports
import { Layout } from './layout';
import { TunnelProvider } from 'components/tunnel';

const log = require('debug')('app');

interface State {}

export interface AppProps {}

@hot(module)
@WithRouter()
@observer
export class App extends React.Component<AppProps & WithRouterProps, any> {
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: Routes;

    static displayName  = 'App';
    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push      : PropTypes.func.isRequired,
                replace   : PropTypes.func.isRequired,
                createHref: PropTypes.func.isRequired,
            }).isRequired,
        }).isRequired,
    };

    context: { router: BrowserRouter };

    constructor(props: {} & WithRouterProps, context: { router: Router }) {
        super(props, context);
        if ( ! app.isBound('router') ) {
            app.bind('router').toConstantValue(context.router);
        }
        if ( ! app.isBound('history') ) {
            app.bind('history').toConstantValue(props.history);
        }
        props.history.listen((location, action) => {
            log('location', action, location);
        });
    }

    render() {
        return (
            <ErrorBoundary>
                {/*<TunnelProvider>*/}
                    <Layout>
                        <Helmet
                            defaultTitle={this.store.codex.display_name}
                            titleTemplate={this.store.codex.display_name + ' - %s'}
                            //{...this.store.helmet}
                        />
                        <ErrorBoundary>
                            <RouterPages routes={this.routes}/>
                        </ErrorBoundary>
                    </Layout>
                {/*</TunnelProvider>*/}
            </ErrorBoundary>
        );
    }

}
