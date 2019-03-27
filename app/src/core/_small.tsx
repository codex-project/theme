///<reference path="../modules.d.ts"/>
///<reference path="../globals.d.ts"/>
///<reference path="../../../node_modules/@types/zepto/index.d.ts"/>

// import './styling/semantic.less'
// import './styling/stylesheet.scss'
import 'source-map-support/register'
import 'bluebird-global'
import 'reflect-metadata';
// import './utils/zepto';
// import './vendor'

import './ioc';
import './init';
import { app, lazyInject } from './ioc';
import { containerModule } from './container-module';

app.load(containerModule);

export * from './classes/Dispatcher';
export * from './classes/Application';
export * from './classes/HtmlParser';
export * from './classes/Hyper';
export * from './classes/ComponentRegistry';
export * from './classes/Url';
export * from './classes/CssVariables';
export * from './classes/Plugin';
export * from './collections/Map';

export * from './interfaces';
export * from './decorators';
export * from './components';
export * from './menus';
export * from './router';
export * from './stores';
export * from './pages';

export * from './utils/breakpoints';
export * from './utils/colors';
export * from './utils/createObservableContext';
export * from './utils/general';
export * from './utils/getElementType';
export * from './utils/getClassNamer';
export * from './utils/loadPolyfills';
export {default as md5} from './utils/md5';
export { default as Platform } from './utils/platform';
export * from './utils/scroll';
export * from './utils/scrollTo';
export * from './utils/storage';
export * from './utils/styleToString';
export * from './utils/thenBy';
export {styled} from './utils/styled';
import * as scroll from './utils/scroll';
export { scroll };

export { app, lazyInject};
