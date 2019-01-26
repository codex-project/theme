import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Store } from 'stores';
import { app, lazyInject } from 'ioc';
import { ErrorBoundary } from 'components/errors';
import { TunnelProvider } from 'components/tunnel';
import Layout from 'components/layout';
import { History, RouteGroup, RouteMap } from 'router';
import { generatePath, Router } from 'react-router';
import { Link } from 'react-router-dom';
import { WithRouter, WithRouterProps } from 'decorators';

const log = require('debug')('App5');

interface State {}

export interface AppProps {}


@observer
@WithRouter()
class AppComponent extends React.Component<AppProps & WithRouterProps, any> {
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: RouteMap;
    @lazyInject('history') history: History;

    static displayName  = 'AppComponent';
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
                        {this.renderLinks()}
                        <ErrorBoundary key={this.history.location.key}>
                            <RouteGroup routes={this.routes} withTransitions={true}/>
                        </ErrorBoundary>
                    </Layout>
                </TunnelProvider>
            </ErrorBoundary>
        );
    }


    renderLinks() {

        const linkData                       = [
            'home',
            'documentation',
            [ 'documentation.project', { project: 'codex' } ],
            [ 'documentation.revision', { project: 'codex', revision: '2.0.0-alpha' } ],
            [ 'documentation.document', { project: 'codex', revision: '2.0.0-alpha', document: 'index' } ],
            [ 'documentation.project', { project: 'does-not-exist' } ],
            [ 'documentation.revision', { project: 'codex', revision: 'does-not-exist' } ],
            [ 'documentation.document', { project: 'codex', revision: '2.0.0-alpha', document: 'does-not-exist' } ],
        ];
        const linkStyle: React.CSSProperties = {
            border        : '1px solid black',
            padding       : 2,
            marginRight   : 2,
            fontSize      : 12,
            textDecoration: 'none',
        };
        const links                          = linkData
            .map((link: any) => {
                let result: any = { name: link };
                if ( typeof link !== 'string' ) {
                    result.name   = link[ 0 ];
                    result.params = link[ 1 ];
                }
                return result;
            })
            .filter(result => this.routes.has(result.name))
            .map(result => {
                let route   = this.routes.get(result.name);
                result.path = generatePath(route.path, result.params);
                return result;
            });

        return (
            <div>
                {links.map((link, i) => <Link key={link.path} to={link.path} style={linkStyle}>{link.path}</Link>)}
            </div>
        );
    }

}

export const App = hot(AppComponent);
