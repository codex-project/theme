import React, { Component } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { RouteDefinition, RouteState } from './routeMap';
import { RenderRoute } from './RenderRoute';

export interface RoutesProps {
    routes: Map<string, RouteDefinition>
}

const makeRouteState = (props: RouteComponentProps, definition: RouteDefinition): RouteState => {
    const { name, action, render, component, location, children, ...routeDefinition } = definition;
    return {
        name : name,
        route: { ...routeDefinition },
        ...props.location,
        ...props.match,
    };
};

class RoutesComponent extends Component<RoutesProps & RouteComponentProps> {
    static displayName                        = 'Routes';
    static defaultProps: Partial<RoutesProps> = {};

    renderRoute(this: RoutesComponent, props, definition) {
        let routeState = makeRouteState(props, definition);
        return <RenderRoute {...props} routeState={routeState} definition={definition}/>;
    }

    render() {
        const { children, staticContext, ...props } = this.props;
        let routes                                  = Array.from(this.props.routes.values());

        return (
            <Switch location={props.location}>
                {routes.map((route, i) => {
                    return (
                        <Route
                            key={i}
                            sensitive={route.sensitive}
                            strict={route.strict}
                            path={route.path}
                            exact={route.exact}
                            render={props1 => this.renderRoute(props1, route)}
                        />
                    );
                })}
            </Switch>
        );
    }
}

export const Routes = withRouter<RoutesProps & RouteComponentProps>(RoutesComponent as any);
