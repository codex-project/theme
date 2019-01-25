import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { RouteDefinition, RouteState } from './types';
import { RouteComponentProps } from 'react-router';

const log = require('debug')('router:RenderRoute');

export type RouteLoader = 'forward' | 'loadComponent' | 'loadData'

export interface RenderRouteProps {
    definition: Partial<RouteDefinition>
    routeState: RouteState
}

@observer
export class RenderRoute extends Component<RenderRouteProps & RouteComponentProps> {
    static displayName                             = 'RenderRoute';
    static defaultProps: Partial<RenderRouteProps> = {};
    state                                          = { action: null, loading: true };

    load() {
        const { children, definition, staticContext, ...props } = this.props;
        if ( definition.action ) {
            log('load', this);
            if ( this.state.action ) {
                return;
            }
            this.setState({ loading: true });
            definition.action(props, props.routeState).then(action => {
                this.setState({ action, loading: false });
            });
        }
    }

    componentDidMount() {
        this.load();
    }

    render() {
        log('render', this);
        const { children, definition, routeState, staticContext, ...props } = this.props;
        if ( definition.action && this.state.loading ) {
            return null;
        }
        if ( definition.action && ! this.state.loading && this.state.action ) {
            return this.state.action;
        }
        let Component = null;
        if ( definition.component ) {
            Component = definition.component;
        }
        if ( Component === null ) {
            return Component;
        }

        return <Component {...props} />;
    }
}

