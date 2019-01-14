import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IRoute } from 'interfaces';
import { SwitchProps } from 'react-router';
import { merge } from 'lodash';
import { componentLoader } from 'utils/componentLoader';

const log = require('debug')('renderRoutes');

export interface RenderRouteOptions {
    extraProps?: any
    switchProps?: SwitchProps
}

function getOptions(options: RenderRouteOptions = {}) {
    let defaultOptions: RenderRouteOptions = {
        extraProps : {},
        switchProps: {},
    };
    return merge(defaultOptions, options);
}

export function renderRoutes(routes?: IRoute[], options: RenderRouteOptions = {}) {
    options                         = getOptions(options);
    let { extraProps, switchProps } = options;
    return (
        <If condition={routes}>
            <Switch {...switchProps}>
                {routes.map((route, i) => (
                    <Route
                        key={route.name || i}
                        path={route.path}
                        exact={route.exact}
                        strict={route.strict}
                        {...route as any}
                        render3={routeProps => {
                            log('render', route.name, routeProps.location.pathname, {route,routeProps})
                            return React.createElement(componentLoader(
                                {
                                    Component: async () => route.loadComponent ? await route.loadComponent(routeProps) : route.component ? route.component : null,
                                    data     : async () => route.onActivate ? await route.onActivate(routeProps) : null,
                                },
                                (loaded, props) => {
                                    let { Component, data } = loaded;
                                    if ( route.render ) {
                                        let rendered = route.render(props, Component, data);
                                        if ( rendered !== undefined ) {
                                            return rendered;
                                        }
                                    }
                                    return <Component {...props} {...data} />;
                                },
                                { delay: 1000 },
                            ))
                        }}

                    />
                ))}
            </Switch>
        </If>
    );
}
