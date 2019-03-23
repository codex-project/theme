import { loader } from 'components/loader';
import React from 'react';
import { OffCanvasProps } from './OffCanvas';

export * from './utils';

export const OffCanvas = loader<OffCanvasProps>(() => import(/* webpackChunkName: "core.components.off-canvas" */'./OffCanvas'))

