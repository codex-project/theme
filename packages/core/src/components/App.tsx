import * as React from 'react';
import PropTypes from 'prop-types';
import { hot, WithRouter, WithRouterProps } from '../decorators';
import { BrowserRouter } from 'react-router-dom';
import { Store } from '../stores';
import { observer } from 'mobx-react';
import { Routes } from '../collections/Routes';
import { app, lazyInject } from '../ioc';
import { Helmet } from 'react-helmet';
import { ErrorBoundary } from './errors';
import { RouterPages } from './router-pages';

import 'styling/stylesheet.scss';
import 'styling/semantic.less';
// noinspection ES6UnusedImports
import styles from './App.mscss'
import './App.mscss'
import { Layout } from './layout';

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

    constructor(props: {} & WithRouterProps, context: { router: BrowserRouter }) {
        super(props, context);
        if ( ! app.isBound(BrowserRouter) ) {
            app.bind(BrowserRouter, 'router').toConstantValue(context.router);
        }
        if ( ! app.isBound('history') ) {
            app.bind('history').toConstantValue(props.history);
        }
    }

    render() {
        return (

            <ErrorBoundary>
                <Layout>
                    <Helmet
                        defaultTitle={this.store.codex.display_name}
                        titleTemplate={this.store.codex.display_name + ' - %s'}
                    />
                    <ErrorBoundary>
                        <RouterPages routes={this.routes}/>
                    </ErrorBoundary>
                </Layout>
            </ErrorBoundary>
        );
    }


    render2() {
        // let routes = app.get<Routes>('routes')
        return (
            <Layout>
                <Helmet
                    defaultTitle={this.store.codex.display_name}
                    titleTemplate={this.store.codex.display_name + ' - %s'}
                />
                <ErrorBoundary>
                    {/*<LayoutHeader/>*/}
                </ErrorBoundary>

                <Layout>

                    <ErrorBoundary>
                        {/*<LayoutSidebar/>*/}
                    </ErrorBoundary>

                    <ErrorBoundary>
                        {/*<LayoutContent>*/}
                        <ErrorBoundary>
                            <RouterPages routes={this.routes}/>
                        </ErrorBoundary>
                        {/*</LayoutContent>*/}
                    </ErrorBoundary>

                </Layout>

                <ErrorBoundary>
                    {/*<LayoutFooter/>*/}
                </ErrorBoundary>
            </Layout>
        );
    }
}
