import toRegex from 'path-to-regexp';
import urljoin from 'url-join';
import { RouteMap } from 'router/Router';

export const joinURL = (...parts: string[]) => urljoin(...parts);

export function matchURI(path, uri) {
    const keys    = [];
    const pattern = toRegex(path, keys); // TODO: Use caching
    const match   = pattern.exec(uri);
    if ( ! match ) return null;
    const params = Object.create(null);
    for ( let i = 1; i < match.length; i ++ ) {
        params[ keys[ i - 1 ].name ] =
            match[ i ] !== undefined ? match[ i ] : undefined;
    }
    return params;
}

export function matchPath(routes: RouteMap, path: string) {
    for ( const route of routes.values() ) {
        const params = matchURI(route.path, path);
        if ( ! params ) return route;
        const result = await route.action({ ...context, params });
        if ( result ) return result;
    }
}
