export * from './utils';

import React from 'react';
import loadable from '@loadable/component';
import OffCanvasClass from './OffCanvas';

export interface OffCanvas extends OffCanvasClass {

}
export const OffCanvas: typeof OffCanvasClass = loadable(() => import(/* webpackChunkName: "core.components.off-canvas" */'./OffCanvas')) as any;

