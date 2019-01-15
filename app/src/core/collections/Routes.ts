import { IDefinedRoute, IRoute } from '../interfaces';
import { lazyInject } from '../ioc';
import { ArrayUtils } from './ArrayUtils';

import pathToRegexp from 'path-to-regexp';
import { generatePath, matchPath } from 'react-router';
// @ts-ignore
import H = require('history');

const log = require('debug')('collections:routes');

const addTestKeysToRoutes = (routes: IRoute[]): IDefinedRoute[] => routes.map((route: IDefinedRoute) => {
    try {
        route.keys   = [];
        route.test   = pathToRegexp(route.path, route.keys);
        route.toPath = pathToRegexp.compile(route.path.toString());
        // route.parsed = pathToRegexp.parse(route.path.toString())
        if ( route.children ) route.routes = addTestKeysToRoutes(route.children);
    } catch ( e ) {
        console.warn('setRoutes', e);
    }
    return route;
});

export class Routes<T extends IDefinedRoute = IDefinedRoute> extends Array<T> implements Array<T> {
    @lazyInject('history') history: H.History;

    constructor(...items: T[]) {
        super();
        Object.setPrototypeOf(this, Routes.prototype);
    }

    getCurrentRoute(): T | undefined {
        let path    = this.history.location.pathname;
        let current = this.find(route => route.test.test(path));
        log('getCurrentRoute', 'history', this.history);
        return current;
    }

    addRoutes(...routes: T[]) {
        this.push(...addTestKeysToRoutes(routes) as any);
    }

    generatePath(pattern: string, params?: { [ paramName: string ]: string | number | boolean }) {
        return generatePath(pattern, params);
    }

    matchPath<Params extends { [K in keyof Params]?: string }>(props) {return matchPath<Params>(this.history.location.pathname, props); }

    getRoute(name: string) {return this.findBy('name', name);}

    findBy(key: string, value: any): T | undefined { return this.rfind(item => item[ key ] === value); }

    where(key: string, value: any): Routes<T> { return this.rfilter(item => item[ key ] === value); }

    rfilter(predicate: (value: T, index: number, obj: T[]) => boolean): Routes<T> { return new Routes(...ArrayUtils.rfilter(this, predicate)); }

    rfind(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined { return ArrayUtils.rfind(this, predicate); }

}
