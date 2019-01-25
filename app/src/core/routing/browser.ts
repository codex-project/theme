import { Browser } from 'router5-plugin-browser/types/types';
import { toJS } from 'mobx';

const value = arg => () => arg;
const noop  = () => {};

const isBrowser = typeof window !== 'undefined' && window.history;

const getBase = () => window.location.pathname;

const supportsPopStateOnHashChange = () =>
    window.navigator.userAgent.indexOf('Trident') === - 1;

const pushState = (state, title, path) =>
    window.history.pushState(toJS(state), title, path);

const replaceState = (state, title, path) =>
    window.history.replaceState(toJS(state), title, path);

const addPopstateListener = (fn, opts) => {
    const shouldAddHashChangeListener =
              opts.useHash && ! supportsPopStateOnHashChange();

    window.addEventListener('popstate', fn);

    if ( shouldAddHashChangeListener ) {
        window.addEventListener('hashchange', fn);
    }

    return () => {
        window.removeEventListener('popstate', fn);

        if ( shouldAddHashChangeListener ) {
            window.removeEventListener('hashchange', fn);
        }
    };
};

const getLocation = opts => {
    const path = opts.useHash
                 ? window.location.hash.replace(new RegExp('^#' + opts.hashPrefix), '')
                 : window.location.pathname.replace(new RegExp('^' + opts.base), '');

    const correctedPath = path.replace(/\|/g, '%7C');

    return (correctedPath || '/') + window.location.search;
};

const getState = () => window.history.state;

const getHash = () => window.location.hash;


export const SimpleBrowser: Browser = {
    getBase,
    pushState,
    replaceState,
    addPopstateListener,
    getLocation,
    getState,
    getHash,
};
export const SafeBrowser: Browser   = {
    getBase            : value(''),
    pushState          : noop,
    replaceState       : noop,
    addPopstateListener: noop,
    getLocation        : value(''),
    getState           : value(null),
    getHash            : value(''),
};
let browser: Browser;
if ( isBrowser ) {
    browser = SimpleBrowser;
} else {
    browser = SafeBrowser;
}
export default browser as Browser;
