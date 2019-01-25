import { NavigationOptions, Route as BaseRoute, Router as BaseRouter, State as BaseState } from 'router5';
import { Params } from 'router5/types/types/base';

export interface LinkData extends NavigationOptions{
    name: string
    params?: Params
}

export interface Route extends BaseRoute {
}

export interface State extends BaseState {
}

export interface Router extends BaseRouter {

}

export type IRouteMap = Map<string, Route>;
