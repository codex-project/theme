///<reference path="../modules.d.ts"/>
///<reference path="../globals.d.ts"/>
import './styling/semantic.less'
import './styling/stylesheet.scss'

import 'reflect-metadata';
import './utils/zepto';

import './ioc';
import './init';
import { app, lazyInject } from './ioc';
import { containerModule } from './container-module';

app.load(containerModule);

export * from './interfaces';
export * from './classes/Dispatcher';
export * from './classes/Application';
export * from './classes/HtmlComponents';
export * from './classes/Url';
export * from './classes/CssVariables';
export * from './classes/ApiLocalStorageCache';
export * from './classes/Plugin';
export * from './collections/Collection';
export * from './collections/DictionaryWrapper';
export * from './collections/ArrayUtils';
export * from './collections/ObservableDictionaryWrapper';

export * from './decorators';
export * from './components';
export * from './menus';
export * from './router';
export * from './stores';

export * from './utils/box';
export * from './utils/breakpoints';
export * from './utils/colors';
export * from './utils/componentLoader';
export * from './utils/event';
export * from './utils/general';
export * from './utils/get-prism';
export * from './utils/loadPolyfills';
export * from './utils/md5';
export * from './utils/menus';
export { default as Platform } from './utils/platform';
// export * from './utils/prism';
export * from './utils/promise';
export * from './utils/scroll';
export * from './utils/scrollTo';
export * from './utils/storage';

export { app, lazyInject };



