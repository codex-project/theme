import React, { ComponentType } from 'react';
import loadable from '@loadable/component';

import { MermaidProps } from './Mermaid';
export type MermaidComponent = ComponentType<MermaidProps> & {}
export let Mermaid: MermaidComponent = loadable(() => import(
    /* webpackChunkName: "core.components.code-renderer.mermaid" */
    './Mermaid'
    ),
);1



import { ChartProps } from './Chart';
export type ChartComponent = ComponentType<ChartProps> & {}
export let Chart: ChartComponent = loadable(() => import(
    /* webpackChunkName: "core.components.code-renderer.chart" */
    './Chart'
    ),
);



import { MathematicaProps } from './Mathematica';
export type MathematicaComponent = ComponentType<MathematicaProps> & {}
export let Mathematica: MathematicaComponent = loadable(() => import(
    /* webpackChunkName: "core.components.code-renderer.mathematica" */
    './Mathematica'
    ),
);




import { NomnomlProps } from './Nomnoml';
export type NomnomlComponent = ComponentType<NomnomlProps> & {}
export let Nomnoml: NomnomlComponent = loadable(() => import(
    /* webpackChunkName: "core.components.code-renderer.nomnoml" */
    './Nomnoml'
    ),
);



