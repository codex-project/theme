import md5 from '../utils/md5';
import { LocalStorage } from '../utils/storage';
import { Api } from '@codex/api';

const name = 'ApiLocalStorageCache';

export interface ApiLocalStorageCacheOptions {
    maxAge?: number
    control?: RequestInit['cache'];
    storageKey?: string
    public?: boolean
}

export class ApiLocalStorageCache {
    constructor(protected options: ApiLocalStorageCacheOptions = {}) {
        this.options = {
            maxAge    : 9999,
            control   : 'no-cache',
            storageKey: 'codex_api_localstorage_cache',
            public    : true,
            ...options,
        };

    }

    apply(api: Api) {
        if ( ! LocalStorage.has(this.options.storageKey) ) {
            LocalStorage.set(this.options.storageKey, {});
        }
        api.hooks.query.tap(name, (request) => {
            let headers = {
                'Origin'                        : location.host,
                'Access-Control-Request-Headers': 'Cache-Control,Content-Type,Content-Length,ETag,Date,Access-Control-Allow-Origin',
                // 'X-Requested-With'              : 'XMLHttpRequest',
                'Cache-Control'                 : `max-age=${this.options.maxAge},${this.options.control},${this.options.public ? 'public' : 'private'}`,
            };
            let key     = this.resolveCacheKey(request);
            if ( this.hasKey(key) ) {
                headers[ 'If-None-Match' ] = this.getETag(key);
            }
            api.configure({ headers });
        });
        api.hooks.queryResult.tap(name, (result) => {
            let key = this.resolveCacheKey(result.request);
            if ( result.status === 200 && ! result.hasErrors() ) {
                if ( result.headers.has('ETag') ) {
                    let etag = result.headers.get('ETag');
                    this.set(key, etag, result.data);
                }
            } else if ( result.status === 304 ) {
                if ( result.headers.has('ETag') ) {
                    let etag = result.headers.get('ETag');
                    if ( this.has(key, etag) ) {
                        result.data = this.get(key, etag);
                        return result;
                    }
                }
            }
            return result;
        });
    }

    resolveCacheKey(request) {
        return md5(JSON.stringify(request));
    }

    set(key, etag, value) {
        let data    = LocalStorage.get.item(this.options.storageKey);
        data[ key ] = { etag, value };
        LocalStorage.set(this.options.storageKey, data);
    }

    hasKey(key) {
        let data = LocalStorage.get.item(this.options.storageKey);
        return data[ key ] !== undefined;
    }

    getETag(key) {
        let data = LocalStorage.get.item(this.options.storageKey);
        return data[ key ].etag;
    }

    has(key, etag) {
        let data = LocalStorage.get.item(this.options.storageKey);
        if ( data[ key ] && data[ key ].etag === etag ) {
            return true;
        }
        if ( data[ key ] && data[ key ].etag !== etag ) {
            delete data[ key ];
            LocalStorage.set(this.options.storageKey, data);
        }
        return false;
    }

    get(key, etag) {
        let data = LocalStorage.get.item(this.options.storageKey);
        if ( data[ key ] && data[ key ].etag === etag ) {
            return data[ key ].value;
        }
        throw Error('Could not get');
    }
}
