///<reference path="./modules.d.ts"/>
///<reference path="../modules.d.ts"/>
///<reference path="../globals.d.ts"/>
import { PhpdocPlugin } from './PhpdocPlugin';
import * as types from './logic/types';

export * from './components';
export * from './logic/FQNS';
export * from './logic/PhpdocStore';
export * from './logic/Query';
export * from './logic/Type';
export * from './logic/collections';

export { types };
export default PhpdocPlugin;
