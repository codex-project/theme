import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Route } from '../interfaces';
import { State } from '../State';

const log = require('debug')('router:components:View');

export interface ViewProps {
    name: string,
    route: Route
    render?: (props: ViewProps) => React.ReactElement<any>

    match?: boolean
    state?: State
}

@hot(module)
export class View extends Component<ViewProps> {
    static displayName                      = 'View';
    static defaultProps: Partial<ViewProps> = {};

    render() {
        const { children, name, route, render, match, state, ...props } = this.props;

        if ( state.render ) {
            return state.render(state);
        }
        if ( route.component ) {
            if ( render ) {
                return render(this.props);
            }
            return React.createElement(route.component, { key: name, name, route, routeState: state });
        }
        return null;
    }
}
