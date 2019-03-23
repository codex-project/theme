import { loader } from 'components/loader';
import React from 'react';
import OffCanvas,{ OffCanvasProps } from './OffCanvas';

export * from './utils';
export {OffCanvas}
// export const OffCanvas = loader<OffCanvasProps>(() => import(/* webpackChunkName: "core.components.off-canvas" */'./OffCanvas')) as any;

