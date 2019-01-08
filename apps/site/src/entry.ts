import 'core-js/es6/promise';

export async function loadPolyfills() {

    const fillFetch = async () => {
        if ( 'fetch' in window ) return
        return import('whatwg-fetch')
    }
    // const fillIntl = async () => {
    //     if ( 'Intl' in window ) return
    //     return import('intl')
    // }

    const fillES6            = async () => {
        if ( 'startsWith' in String.prototype && 'assign' in Object ) return
        return import('core-js/es6')
    }
    const fillES7            = async () => {
        if ( 'includes' in Array.prototype ) return
        return import('core-js/es7')
    }
    const fillResizeObserver = async () => {
        if ( 'ResizeObserver' in window ) return
        return import('../build/resize-observable-polyfill')
    }

    return Promise.all([
        fillFetch(),
        fillES6(),
        fillES7(),
        fillResizeObserver()
    ])
}


export async function loadApp(){
    let app = await import(/* webpackChunkName: "site.index" */'./index');
    return app;
}
