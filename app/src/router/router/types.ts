import * as H from 'history';
import { match, RouteComponentProps, RouteProps } from 'react-router';
import React from 'react';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

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
    action?: (props: RouteActionDefnitionProps, routeState: RouteState) => Promise<React.ReactNode>

    component?: RouteProps['component']
    render?: RouteProps['render']
    children?: RouteProps['children']
    exact?: RouteProps['exact']
    sensitive?: RouteProps['sensitive']
    strict?: RouteProps['strict']
}
