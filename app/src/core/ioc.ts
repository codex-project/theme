import { Application } from './classes/Application';
import createInjectDecorators from 'inversify-inject-decorators';
import { decorate, injectable } from 'inversify';


const log = require('debug')('ioc');

export const app: Application= new Application({
    // autoBindInjectable : true,
    defaultScope       : 'Transient',
    skipBaseClassChecks: true,
});

export const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = createInjectDecorators(app, false);
export { decorate, injectable };
