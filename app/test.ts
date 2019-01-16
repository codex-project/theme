// import 'cross-fetch/dist/node-polyfill';
// import { Api } from '@codex/api/src';
// import md5 from './src/core/utils/md5';
// import { resolve } from 'path';
// import { readFileSync, writeFileSync } from 'fs';
//
// const name = 'ApiLocalStorageCache';
//
//
// export class CacheStore {
//     constructor(protected options:any={}){}
//
//     set(key, value) {
//         let data    = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         data[ key ] = value;
//         writeFileSync(resolve(__dirname, 'test.json'), JSON.stringify(data), 'utf8');
//     }
//
//     has(key):boolean {
//         let data = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         return data[ key ]!== undefined;
//     }
//
//     get(key):any {
//         let data = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         return data[ key ];
//     }
//
//     isExpired(key, etag) {
//         let data = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         if ( data[ key ] && data[ key ].etag === etag ) {
//             return false;
//         }
//         if ( data[ key ] && data[ key ].etag !== etag ) {
//             delete data[ key ];
//             writeFileSync(resolve(__dirname, 'test.json'), JSON.stringify(data), 'utf8');
//         }
//         return true;
//     }
// }
//
// export class CacheProfile {
//     store:CacheStore
//
//     resolveCacheKey(request) {
//         return md5(JSON.stringify(request));
//     }
//
// }
//
//
// export class ApiLocalStorageCache {
//     constructor(protected options: any = {}) {
//     }
//
//     apply(api: Api) {
//         api.hooks.query.tap(name, (request) => {
//             let headers = {
//                 'Cache-Control': 'max-age=9999,no-cache',
//             };
//             let key     = this.resolveCacheKey(request);
//             if ( this.hasKey(key) ) {
//                 headers[ 'If-None-Match' ] = this.getETag(key);
//             }
//             api.configure({ headers });
//         });
//         api.hooks.queryResult.tap(name, (result) => {
//             if ( ! result.ok ) {
//                 return;
//             }
//             let key = this.resolveCacheKey(result.request);
//             if ( result.status === 200 && ! result.hasErrors() ) {
//                 if ( result.headers.has('ETag') ) {
//                     let etag = result.headers.get('ETag');
//                     this.set(key, etag, result.data);
//                 }
//             } else if ( result.status === 304 ) {
//                 if ( result.headers.has('ETag') ) {
//                     let etag = result.headers.get('ETag');
//                     if ( this.has(key, etag) ) {
//                         result.data = this.get(key, etag);
//                         return result;
//                     }
//                 }
//             }
//             return result;
//         });
//     }
//
//     resolveCacheKey(request) {
//         return md5(JSON.stringify(request));
//     }
//
//     set(key, etag, value) {
//         let data    = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         data[ key ] = { etag, value };
//         writeFileSync(resolve(__dirname, 'test.json'), JSON.stringify(data), 'utf8');
//     }
//
//     hasKey(key) {
//         let data = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         return data[ key ]!== undefined;
//     }
//
//     getETag(key) {
//         let data = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         return data[ key ].etag;
//     }
//
//     has(key, etag) {
//         let data = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         if ( data[ key ] && data[ key ].etag === etag ) {
//             return true;
//         }
//         if ( data[ key ] && data[ key ].etag !== etag ) {
//             delete data[ key ];
//             writeFileSync(resolve(__dirname, 'test.json'), JSON.stringify(data), 'utf8');
//         }
//         return false;
//     }
//
//     get(key, etag) {
//         let data = JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'));
//         if ( data[ key ] && data[ key ].etag === etag ) {
//             return data[ key ].value;
//         }
//         throw Error('Could not get');
//     }
//
//
//     // hasETag(etag: string) {
//     //     return JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'))[ etag ] !== undefined;
//     // }
//     //
//     // getETagValue(etag: string) {
//     //     return JSON.parse(readFileSync(resolve(__dirname, 'test.json'), 'utf8'))[ etag ];
//     // }
//     //
//     // setETagValue(etag: string, value: any) {
//     // }
// }
//
// async function query() {
//
//     let api = new Api();
//     api.configure({ url: 'http://codex.local/api' });
//
//     let cache = new ApiLocalStorageCache();
//     cache.apply(api);
//     let result;
//     try {
//         result = await api.query(`
// query {
//     project(key: "codex") {
//         key
//     }
// }`);
//     } catch ( e ) {
//         console.log(e);
//     }
//
//     let a = result;
// }
//
// query();
