import Promise from 'bluebird-global';
import {parse} from 'querystring';

Promise.config({
    cancellation: true,
    warnings    : false
});


if ( typeof __resourceQuery === 'string' && __resourceQuery ) {
    let query = parse(__resourceQuery.substr(1));
    var publicPaths = (window['__CODEX_PUBLIC_PATHS'] || {});
    if ( publicPaths[query.entryName] ) {
        console.log('pre-path', query.entryName, {query, publicPaths});
        __webpack_public_path__ = publicPaths[query.entryName];
    }
}

