import { app } from 'ioc';
import { Store } from 'stores';
import urljoin from 'url-join';

const make      = (prefix: string, ...parts: string[]) => urljoin(prefix, ...parts);
const getPrefix = (name: string) => {
    if ( app.isBound('store') ) {
        let store = app.get<Store>('store');
        if ( name in store.codex.urls ) {
            return store.codex.urls[ name ];
        }
    }
    return BACKEND_DATA.codex.urls[ name ];
};

export interface IUrl {
    [ key: string ]: (...parts: string[]) => string

    make: (prefix: string, path: string) => string
    getPrefix: (name: string) => string
}

class Url implements IUrl {
    [ key: string ]: (...parts: string[]) => string

    make      = make;
    getPrefix = getPrefix;
}

export const url: IUrl = new Proxy(new Url(), {
    get(target: Url, property: PropertyKey, receiver: any): any {
        let name = property.toString();
        if ( name in target ) {
            return target[ name ];
        }

        return (...parts: string[]) => {
            let prefix = target.getPrefix(name);
            return target.make(prefix, ...parts);
        };
    },
});
