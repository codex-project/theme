import Promise from 'bluebird'; //= require('bluebird')
Promise.config({
    cancellation:true,
    warnings: false
})
let i = 0;

//
//
// function Promise (...args) {
//     console.groupCollapsed(`Promise #${i}`);
//     console.trace(`Promise #${i}`, ...args);
//     console.groupEnd();
//
//     return _promise(...args);
// }


declare const window,root,global;

if ( typeof global !== 'undefined' )
    global.Promise = Promise;
if ( typeof window !== 'undefined' )
    window.Promise = Promise;
if ( typeof root !== 'undefined' )
    root.Promise = Promise;
