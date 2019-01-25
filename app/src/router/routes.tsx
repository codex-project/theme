import React from 'react';
import HomePage from './HomePage';
import { match, RouteProps } from 'react-router';
import * as H from 'history';
import { RouteComponentProps } from '../core/router';

const log = require('debug')('router:routes');

export type RouteState<Params extends { [K in keyof Params]?: string } = any, S = H.LocationState> = H.Location<S> & match<Params> & {
    name: string
    route: Partial<RouteDefinition>
}

export type RouteComponentType<P = {}> = React.ComponentType<RouteComponentProps & P>

export type RouteLoadedComponentProps<P = {}, SP extends any = any> = { routeState?: RouteState<SP, any> } & P
export type RouteLoadedComponent<P = {}> = RouteComponentType<RouteLoadedComponentProps<P>>
export type RouteDefinitionLoadComponent<P extends any = any, SP extends any = any, T = RouteLoadedComponent<P>> = (routeState: RouteState<SP>) => Promise<{ default: T } | T>

export interface RouteDefinition extends RouteProps {
    name: string
    path: string

    loadData?(routeState: RouteState): Promise<any>

    forward?(routeState: RouteState): Promise<any>

    loadComponent?: RouteDefinitionLoadComponent


}

export const routes: RouteDefinition[] = [
    {
        name     : 'home',
        path     : '/',
        exact    : true,
        component: HomePage,
        loadData : async (state) => {
            log('home loadData', { state });
            let promise = new Promise((resolve, reject) => setTimeout(() => resolve({ home: 'ok' }), 500));
            let result  = await promise;
            log('home loadData done', { state, result, promise });
            return { data: result };
        },
    },
    {
        name   : 'documentation',
        path   : '/documentation',
        exact  : true,
        forward: async (params) => {
            return {
                name  : 'documentation.project',
                params: { project: 'codex' },
            };
        },
    },
    {
        name   : 'documentation.project',
        path   : '/documentation/:project',
        exact  : true,
        forward: async (state) => {
            const { project } = state.params;
            return {
                name  : 'documentation.revision',
                params: { project, revision: 'master' },
            };
        },
    },
    {
        name   : 'documentation.revision',
        path   : '/documentation/:project/:revision',
        exact  : true,
        forward: async (state) => {
            const { project, revision } = state.params;
            return {
                name  : 'documentation.document',
                params: { project, revision, document: 'index' },
            };
        },
    },
    {
        name         : 'documentation.document',
        path         : '/documentation/:project/:revision/:document+',
        exact        : true,
        loadComponent: (state) => import('./DocumentPage'),
        loadData     : async (state) => {
            log('documentation.document loadData', { state });
            let promise = new Promise((resolve, reject) => setTimeout(() => resolve({ document: 'ok' }), 500));
            let result  = await promise;
            log('documentation.document loadData done', { state, result, promise });
            return { data: result };
        },
    },
];
