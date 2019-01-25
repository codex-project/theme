import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { RouteDefinition, RouteState } from './routes';
import { Redirect, RouteComponentProps } from 'react-router';
import { parallel } from 'async';

const log = require('debug')('router:RenderRoute');

export type RouteLoader = 'forward' | 'loadComponent' | 'loadData'

export interface RenderRouteProps {
    definition: Partial<RouteDefinition>
    routeState: RouteState
    children?: (loaded?: Partial<Record<RouteLoader, any>>) => React.ReactNode
}

@observer
export class RenderRoute extends Component<RenderRouteProps> {
    static displayName                             = 'RenderRoute';
    static defaultProps: Partial<RenderRouteProps> = {};

    static makeRouteState(props: RouteComponentProps, definition: RouteDefinition): RouteState {
        const { name, forward, loadComponent, loadData, render, component, location, children, ...routeDefinition } = definition;
        return {
            name : name,
            route: { ...routeDefinition },
            ...props.location,
            ...props.match,
        };
    }

    // @observable loading                          = false;
    @observable loaded: Partial<Record<RouteLoader, any>> = {};

    loading: Record<RouteLoader, Promise<any>> = {
        loadComponent: null,
        loadData     : null,
        forward      : null,
        render       : null,
    };

    @computed get hasLoaders(): boolean {return this.loaders.length > 0;}

    @computed get loaders(): RouteLoader[] {
        const { definition }                                                                                        = this.props;
        const { name, forward, loadComponent, loadData, render, component, location, children, ...routeDefinition } = definition;
        let loaders                                                                                                 = [];
        if ( loadComponent !== undefined ) {
            loaders.push('loadComponent');
        }
        if ( loadData !== undefined ) {
            loaders.push('loadData');
        }
        if ( forward !== undefined ) {
            loaders.push('forward');
        }
        return loaders;
    }

    hasLoader(name: RouteLoader) {return this.loaders.includes(name);}

    @computed get isLoading() {
        return Object.keys(this.loaded).length >= this.loaders.length;
    }

    @action
    async load(name: RouteLoader) {
        if ( this.loaded[ name ] ) {
            return this.loaded[ name ];
        }
        if ( this.loading[ name ] ) {
            return this.loading[ name ];
        }
        const { definition } = this.props;
        let loader           = definition[ name ] as any;
        if ( loader === undefined ) {
            throw new Error(`Loader "${name}" not found in route definition`);
        }
        this.loading[ name ] = loader(this.props.routeState).then(async value => {
            this.loaded[ name ] = value;
            delete this.loading[ name ];
            return value;
        });
        return this.loading[ name ];
    }

    async fetch(): Promise<Partial<Record<RouteLoader, any>>> {
        if ( ! this.hasLoaders ) return;
        let loaders: Partial<Record<RouteLoader, any>> = {};
        this.loaders.forEach(name => loaders[ name ] = this.load(name));
        return new Promise((resolve, reject) => parallel(loaders, (result, error?) => error ? reject(error) : resolve(result)));
    }

    async update() {
        this.fetch();
    }

    public componentDidMount(): void {
        this.update();
    }

    render() {
        const { children, definition, routeState, ...props } = this.props;
        log('render', props, this);

        if ( this.hasLoaders ) {
            if ( this.isLoading ) {
                return null;
            }

            let componentProps: any;
            let Component;
            if ( this.loaded.loadComponent ) {
                Component = this.loaded.loadComponent;
            } else if ( definition.component ) {
                Component = definition.component;
            }
            if ( this.loaded.loadData && definition.render ) {
                return definition.render(this.loaded.loadData);
            }
            if ( this.loaded.loadData && Component ) {
                return <Component {...props} routeState={routeState} {...this.loaded.loadData}/>;
            }
            if ( this.loaded.forward ) {
                return <Redirect to={this.loaded.forward}/>;
            }
            if ( Component ) {
                return <Component {...props} routeState={routeState} {...this.loaded || {}} />;
            }
            log('loaded render nothing');
            return null;
        }

        return <Fragment>{children(this.loaded)}</Fragment>;
    }
}

