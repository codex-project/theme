import { Application } from 'classes/Application';
import createInjectDecorators from 'inversify-inject-decorators';
import { decorate, injectable } from 'inversify';


const log = require('debug')('ioc');

export const app: Application = new Application({
    // autoBindInjectable : true,
    defaultScope       : 'Transient',
    skipBaseClassChecks: true,
});

export const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = createInjectDecorators(app, false);
export { decorate, injectable };


// export const lazyInject = (...args) => {
//     let ret = (_lazyInject as any)(...args);
//     function ret2(...ar){
//         let ret3 = ret(...ar);
//         debugger;
//         return ret3;
//     }
//     return ret2;
// };
