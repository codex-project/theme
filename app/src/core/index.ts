///<reference path="./globals.d.ts"/>
///<reference path="./modules.d.ts"/>
import 'reflect-metadata';
import './init';
import './utils/zepto';

import { app, lazyInject } from './ioc';
import * as url from './utils/url';

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

export * from './utils/componentLoader';
export * from './utils/colors';
export * from './utils/general';
export * from './utils/get-prism';
export * from './utils/scroll';
export * from './utils/scrollTo';
export * from './utils/storage';
export * from './utils/storage';



export { app, lazyInject, url };

if ( module.hot ) {
    module.hot.accept('./components/App', () => {
        import('./components/App').then(component => app.render(component.App));
    });
}
