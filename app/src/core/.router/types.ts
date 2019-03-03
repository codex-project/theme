import * as H from 'history';
import { match, RouteComponentProps, RouteProps } from 'react-router';
import React from 'react';
import pathToRegexp from 'path-to-regexp';

export type RouteState = Partial<H.Location<any>> & Partial<match<any>> & {
    name: string
    route: Partial<RouteDefinition>
}

export type RouteComponentType<P = {}> = React.ComponentType<RouteComponentProps & P>
export type RouteActionDefnitionProps = RouteComponentProps & { routeState: RouteState }

export interface RouteDefinitionLoaderConfig {

}

export interface RouteDefinitionTransitionConfig {

}

export interface RouteDefinition extends Partial<RouteProps> {
    name: string
    path: string
    loader?: RouteDefinitionLoaderConfig | boolean
    transition?: RouteDefinitionTransitionConfig | boolean
    loadComponent?: () => Promise<any>
    action?: (props: RouteActionDefnitionProps, routeState: RouteState,Component?) => Promise<React.ReactNode>

    component?: RouteProps['component']
    render?: RouteProps['render']
    children?: RouteProps['children']
    exact?: RouteProps['exact']
    sensitive?: RouteProps['sensitive']
    strict?: RouteProps['strict']
}

export interface RouteDefinitionTestKeys {
    test?: RegExp
    keys?: pathToRegexp.Key[]
    toPath?: pathToRegexp.PathFunction
}

export type Path = string
export type Action = 'PUSH' | 'POP' | 'REPLACE';
export type UnregisterCallback = () => void;

export interface Location {
    pathname?: string;
    search?: string
    state?: any;
    hash?: string;
    key?: string
}

export interface History {
    length: number;
    action: Action;
    location: Location;

    push(path: Path, state?: any): void;

    push(location: Location): void;

    replace(path: Path, state?: any): void;

    replace(location: Location): void;

    go(n: number): void;

    goBack(): void;

    goForward(): void;

    block(prompt?: boolean | string | any): UnregisterCallback;

    listen(listener: any): UnregisterCallback;

    createHref(location: Location): string;
}
