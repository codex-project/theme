import 'reflect-metadata'
import { Application } from './classes/Application';
import createInjectDecorators from 'inversify-inject-decorators';
import { decorate, injectable, interfaces } from 'inversify';


const log = require('debug')('ioc');

const app: Application = new Application({
    autoBindInjectable: true,
    defaultScope       : 'Transient',
    skipBaseClassChecks: true
});

const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = createInjectDecorators(app);


function singleton<T>(identifier: any, alias?: string, custom?: (binding: interfaces.BindingWhenOnSyntax<T>) => void) {
    return target => {
        try {
            decorate(injectable(), target);
        } catch ( e ) {
            log('singleton decorateinjectable error', e);
        }
        let scope = app.bind<T>(identifier).toSelf().inSingletonScope();
        if ( custom ) {
            custom(scope);
        }
        if ( alias ) {
            app.bind(alias).toDynamicValue(ctx => ctx.container.get(identifier)).inTransientScope();
        }
        return target;
    }
}

export { app, lazyInject, singleton }


if ( DEV ) {
    window[ 'app' ] = app
}
