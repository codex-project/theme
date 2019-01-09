///<reference path="./globals.d.ts"/>
///<reference path="./modules.d.ts"/>
import 'reflect-metadata';
import './init';
import './utils/zepto';

import { app, lazyInject } from './ioc';

export * from './interfaces';

export * from './classes/Dispatcher';
export * from './classes/Application';
export * from './classes/HtmlComponents';
export * from './collections/Collection';
export * from './collections/DictionaryWrapper';
export * from './collections/ArrayUtils';
export * from './collections/ObservableDictionaryWrapper';
export * from './collections/Routes';

export * from './components';
export * from './menus';
export * from './stores';
export * from './decorators';

export { app, lazyInject };

if ( module.hot ) {
    module.hot.accept('./components/App', () => {
        import('./components/App').then(component => app.render(component.App));
    });
}
