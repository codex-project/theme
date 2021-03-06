///<reference path="../modules.d.ts"/>
///<reference path="../globals.d.ts"/>


import * as pathToRegexp from 'path-to-regexp';

namespace generate {

    const cache      = {};
    const cacheLimit = 10000;
    let cacheCount   = 0;

    function compilePath(path) {
        if ( cache[ path ] ) return cache[ path ];

        const generator = pathToRegexp.compile(path);

        if ( cacheCount < cacheLimit ) {
            cache[ path ] = generator;
            cacheCount ++;
        }

        return generator;
    }

    /**
     * Public API for generating a URL pathname from a path and parameters.
     */
    export function path(path = '/', params = {}) {
        return path === '/' ? path : compilePath(path)(params, { pretty: true });
    }
}

namespace match {
    const cache      = {};
    const cacheLimit = 10000;
    let cacheCount   = 0;

    function compilePath(path, options) {
        const cacheKey  = `${options.end}${options.strict}${options.sensitive}`;
        const pathCache = cache[ cacheKey ] || (cache[ cacheKey ] = {});

        if ( pathCache[ path ] ) return pathCache[ path ];

        const keys   = [];
        const regexp = pathToRegexp(path, keys, options);
        const result = { regexp, keys };

        if ( cacheCount < cacheLimit ) {
            pathCache[ path ] = result;
            cacheCount ++;
        }

        return result;
    }

    /**
     * Public API for matching a URL pathname to a path.
     */
    export function path<Params extends { [K in keyof Params]?: string } = {}>(pathname, options: string | { path?: string, exact?: boolean, strict?: boolean, sensitive?: boolean } = {}): Match<Params> {
        if ( typeof options === 'string' ) options = { path: options };

        const { path, exact = false, strict = false, sensitive = false } = options;

        const paths = [].concat(path);

        return paths.reduce((matched, path) => {
            if ( matched ) return matched;
            const { regexp, keys } = compilePath(path, {
                end: exact,
                strict,
                sensitive,
            });
            const match            = regexp.exec(pathname);

            if ( ! match ) return null;

            const [ url, ...values ] = match;
            const isExact            = pathname === url;

            if ( exact && ! isExact ) return null;

            return {
                path, // the path used to match
                url   : path === '/' && url === '' ? '/' : url, // the matched portion of the URL
                isExact, // whether or not we matched exactly
                params: keys.reduce((memo, key, index) => {
                    memo[ key.name ] = values[ index ];
                    return memo;
                }, {}),
            };
        }, null);
    }


}


export interface Match<Params extends { [K in keyof Params]?: string } = {}> {
    name: string
    params: Params;
    isExact: boolean;
    path: string;
    url: string;
}


export const generatePath = generate.path
export const matchPath = match.path
