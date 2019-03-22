import React from 'react';
import { loader } from 'components/loader';

import { MermaidProps } from './Mermaid';
import { ChartProps } from './Chart';
import { MathematicaProps } from './Mathematica';
import { NomnomlProps } from './Nomnoml';
// export type MermaidComponent = ComponentType<MermaidProps> & {}
export let Mermaid = loader<MermaidProps>(() => import(
    /* webpackChunkName: "core.components.code-renderer.mermaid" */
    './Mermaid'
    ),
);
1;


// export type ChartComponent = ComponentType<ChartProps> & {}
export let Chart = loader<ChartProps>(() => import(
    /* webpackChunkName: "core.components.code-renderer.chart" */
    './Chart'
    ),
);


// export type MathematicaComponent = ComponentType<MathematicaProps> & {}
export let Mathematica = loader<MathematicaProps>(() => import(
    /* webpackChunkName: "core.components.code-renderer.mathematica" */
    './Mathematica'
    ),
);


// export type NomnomlComponent = ComponentType<NomnomlProps> & {}
export let Nomnoml = loader<NomnomlProps>(() => import(
    /* webpackChunkName: "core.components.code-renderer.nomnoml" */
    './Nomnoml'
    ),
);



