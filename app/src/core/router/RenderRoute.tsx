import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { RouteDefinition, RouteState } from './types';
import { RouteComponentProps } from 'react-router';
import { lazyInject } from 'ioc';
import { History } from 'router';
import { hot } from 'decorators';

const log = require('debug')('router:RenderRoute');

export type RouteLoader = 'forward' | 'loadComponent' | 'loadData'

export interface RenderRouteProps {
    definition: Partial<RouteDefinition>
    routeState: RouteState
}

@hot(module)
@observer
export class RenderRoute extends Component<RenderRouteProps & RouteComponentProps> {
    static displayName                             = 'RenderRoute';
    static defaultProps: Partial<RenderRouteProps> = {};
    state                                          = { routeName: null, action: null, loading: true, component: this.props.definition.component };
    @lazyInject('history') history: History;


    load() {
        const { children, definition, staticContext, ...props } = this.props;
        log('load', props.routeState.pathname);
        if ( definition.loadComponent && ! definition.component ) {
            definition.loadComponent().then(val => {
                definition.component = val.default ? val.default : val;
                this.setState({ component: definition.component });
            });
        }
        if ( definition.action ) {
            if ( this.state.action ) {
                return;
            }
            this.setState({ routeName: props.routeState.name, loading: true });
            log('loading', props.routeState.pathname);
            definition.action(props, props.routeState).then(action => {
                log('loaded', props.routeState.pathname, action);
                this.setState({ routeName: props.routeState.name, action, loading: false });
            });
        }
    }

    componentDidMount() {
        const { children, definition, routeState, staticContext, ...props } = this.props;
        log('componentDidMount', definition.name, { routeState, state: this.state, action: definition.action });
        this.setState({ name: routeState.name });
        this.load();
    }

    public componentDidUpdate(prevProps: Readonly<RenderRouteProps & RouteComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        const { children, definition, routeState, staticContext, ...props } = this.props;
        // log('componentDidUpdate', definition.name, { routeState, state: this.state, action: definition.action });
        if ( routeState.name !== this.state.routeName ) {
            this.load();
        }
    }

    render() {
        const { children, definition, routeState, staticContext, ...props } = this.props;
        // log('render', definition.name, { routeState, state: this.state, action: definition.action });
        if ( definition.loadComponent && ! this.state.component ) {
            return null;
        }
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

