import * as H from 'history';
import { State } from './State';
import React from 'react';
import { Router } from './Router';

export interface Location extends H.Location {

}

export type To = string | { name: string, params?: any } | Location


export interface Lifecycle {
    canEnter?: (state: State) => Promise<any>
    beforeEnter?: (state: State) => Promise<any>
    enter?: (state: State) => Promise<any>
    canLeave?: (state: State) => Promise<any>
    beforeLeave?: (state: State) => Promise<any>
}


export interface RouteComponentProps {
    [ key: string ]: any

    routeState?: State
}

export type RouteComponent = React.ComponentType<RouteComponentProps> | React.ComponentType<any>;

export interface Route extends Lifecycle {
    name: string
    path?: string
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean


    redirect?: (state: State,router: Router) => Promise<To>
    component?: RouteComponent
    loadComponent?: () => Promise<RouteComponent | { default: RouteComponent }>
}
