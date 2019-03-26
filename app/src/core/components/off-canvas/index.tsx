import React from 'react';
import { loader } from 'components/loader';
import { OffCanvasProps } from './OffCanvas';

export * from './utils';

export const OffCanvas = loader<OffCanvasProps>(() => import(/* webpackChunkName: "core.components.off-canvas" */'./OffCanvas'))

