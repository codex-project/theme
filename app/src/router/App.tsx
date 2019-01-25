import React from 'react';
import { observer } from 'mobx-react';
import { generatePath, Link, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { RouteDefinition, routes } from './routes';
import { hot } from 'react-hot-loader/root';
import { RenderRoute } from './RenderRoute';

const log = require('debug')('router:App');

interface State {}

export interface AppProps {}


@observer
class AppComponent extends React.Component<AppProps & RouteComponentProps, any> {

    static displayName = 'AppComponent';

    render() {
        const { children, history, location, match, staticContext } = this.props;
        log('render', { history, location, match, staticContext });
        return (
            <div>
                <h3>App</h3>
                <div>{this.renderLinks()}</div>
                <div key={location.key}>
                    <Switch location={location}>
                        {routes.map((route, i) => {

                            return (
                                <Route
                                    key={i}
                                    path={route.path}
                                    render={props => this.renderRoute(props, route)}
                                    // component={route.component}
                                    exact={route.exact}
                                    // location={route.location}
                                    sensitive={true}
                                    // strict={route.strict}
                                />
                            );
                        })}
                    </Switch>
                </div>
            </div>
        );
    }

    renderRoute(props: RouteComponentProps, definition: RouteDefinition) {
        log('renderRoute', definition.name, props, definition);
        let routeState = RenderRoute.makeRouteState(props, definition);
        return (
            <RenderRoute routeState={routeState} definition={definition}>
                {loaded => {
                    let componentProps: any;
                    let Component;
                    if ( loaded.loadComponent ) {
                        Component = loaded.loadComponent;
                    } else if ( definition.component ) {
                        Component = definition.component;
                    }
                    if ( loaded.loadData && definition.render ) {
                        return definition.render(loaded.loadData);
                    }
                    if ( loaded.loadData && Component ) {
                        return <Component {...props} routeState={routeState} {...loaded.loadData}/>;
                    }
                    if ( loaded.forward ) {
                        return <Redirect to={loaded.forward}/>;
                    }
                    if ( Component ) {
                        return <Component {...props} routeState={routeState} {...loaded || {}} />;
                    }
                    log('loaded render nothing')
                    return null;
                }}
            </RenderRoute>
        );
    }

    renderLinks() {
        const routeMap = new Map();
        routes.forEach(route => routeMap.set(route.name, route));

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
            .filter(result => routeMap.has(result.name))
            .map(result => {
                let route   = routeMap.get(result.name);
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

export const App = hot(withRouter(AppComponent));
export default App;
