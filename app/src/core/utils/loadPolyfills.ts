///<reference path="../../globals.d.ts"/>

import 'core-js/es6/promise';

export async function loadPolyfills() {

    const fillFetch = async () => {
        if ( 'fetch' in window ) return;
        return import(/* webpackChunkName: "polyfill.fetch" */'whatwg-fetch');
    };
    // const fillIntl = async () => {
    //     if ( 'Intl' in window ) return
    //     return import('intl')
    // }

    const fillES6            = async () => {
        if ( 'startsWith' in String.prototype && 'assign' in Object ) return;
        return import(/* webpackChunkName: "polyfill.es6" */'core-js/es6');
    };
    const fillES7            = async () => {
        if ( 'includes' in Array.prototype ) return;
        return import(/* webpackChunkName: "polyfill.es7" */'core-js/es7');
    };
    const fillResizeObserver = async () => {
        if ( 'ResizeObserver' in window ) return;
        return import(/* webpackChunkName: "polyfill.resize" */'../../../build/resize-observable-polyfill');
    };

    return Promise.all([
        fillFetch(),
        fillES6(),
        fillES7(),
        fillResizeObserver(),
    ]);
}
