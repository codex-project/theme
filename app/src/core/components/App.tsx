import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Store } from 'stores';
import { app, lazyInject } from 'ioc';
import { ErrorBoundary } from 'components/errors';
import { TunnelProvider } from 'components/tunnel';
import Layout from 'components/layout';
import { History, RouteGroup, RouteMap } from 'router';
import { Router } from 'react-router';
import { WithRouter, WithRouterProps } from 'decorators';
import { StoreControl } from 'components/store-control';

const log = require('debug')('App');

interface State {}

export interface AppProps {}


@observer
@WithRouter()
export class App extends React.Component<AppProps & WithRouterProps, any> {
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: RouteMap;
    @lazyInject('history') history: History;

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

    context: { router: Router };

    constructor(props: {} & WithRouterProps, context: { router: Router }) {
        super(props, context);
        if ( ! app.isBound('router') ) {
            app.bind('router').toConstantValue(context.router);
        }
        props.history.listen((location, action) => {
            log('location', action, location);
        });
    }

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
                        <ErrorBoundary key={this.history.location.key}>
                            <RouteGroup routes={this.routes} withTransitions={true}/>
                        </ErrorBoundary>

                        {this.renderStoreController()}
                    </Layout>
                </TunnelProvider>
            </ErrorBoundary>
        );
    }

    renderStoreController() {

        return (
            <StoreControl store={this.store.layout} stores={{
                'container': {
                    stretch: 'boolean',
                },
                'header'   : {
                    show             : 'boolean',
                    height           : 'number',
                    fixed            : 'boolean',
                    color            : 'color.name',
                    logo             : 'boolean',
                    show_left_toggle : 'boolean',
                    show_right_toggle: 'boolean',
                    menu             : 'menu',
                },
                'left'     : {
                    show          : 'boolean',
                    width         : 'number',
                    fixed         : 'boolean',
                    collapsedWidth: 'number',
                    collapsed     : 'boolean',
                    outside       : 'boolean',
                    color         : 'color.name',
                    menu          : 'menu',
                },
                'right'    : {
                    show          : 'boolean',
                    width         : 'number',
                    fixed         : 'boolean',
                    collapsedWidth: 'number',
                    collapsed     : 'boolean',
                    outside       : 'boolean',
                    color         : 'color.name',
                },
                'middle'   : {
                    padding: 'string',
                    margin : 'string',
                    color  : 'color.name',
                },
                'content'  : {
                    padding: 'string',
                    margin : 'string',
                    color  : 'color.name',
                },
                'footer'   : {
                    show  : 'boolean',
                    height: 'number',
                    fixed : 'boolean',
                    color : 'color.name',
                },
            }}/>
        );
    }

}

