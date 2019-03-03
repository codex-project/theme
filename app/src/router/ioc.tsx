import { Container, decorate, injectable } from 'inversify';
import { createRouter } from './createRouter';
import createInjectDecorators from 'inversify-inject-decorators';

export const app = new Container();

export const inject = createInjectDecorators(app, false).lazyInject

export { decorate, injectable };

app.bind('app').toConstantValue(app);

const r = createRouter();
app.bind('router').toConstantValue(r);
