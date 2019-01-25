import React from 'react';
import * as H from 'history';
import Path, { IBuildOptions, ITestOptions } from 'path-parser';

export interface RouteComponentProps {}

export type RouteComponentType<P = {}> = React.ComponentType<RouteComponentProps & P>
export type RouteDefinitionAction = (state: State) => Promise<RouteComponentType<any>>

export interface RouteDefinition {
    name: string
    path: string
    action?: RouteDefinitionAction
}

export interface DefinedRoute extends RouteDefinition {
    pattern: Path
}

export type PatternMatchOptions = ITestOptions
export type PatternBuildOptions = IBuildOptions

export interface NavigateOptions extends IBuildOptions {
    replace?: boolean
}

export type Params = Record<string, string>
export type StateData = Record<string, any>

export interface LinkData<P extends Params = {}> {
    name: string
    params: P
}

export interface State<P extends Params = {}, SD extends StateData = {}> {
    name: string
    params: P
    data: SD
}

export interface RouterOptions {
    basename?: H.BrowserHistoryBuildOptions['basename']
    forceRefresh?: H.BrowserHistoryBuildOptions['forceRefresh']
    getUserConfirmation?: H.BrowserHistoryBuildOptions['getUserConfirmation']
    createBrowser?: (options: H.BrowserHistoryBuildOptions) => H.History
    matching?: PatternMatchOptions
    building?: PatternBuildOptions
    defaultRoute?:string
    defaultParams?:Params
}
