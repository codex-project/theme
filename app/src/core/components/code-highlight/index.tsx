import { CodeHighlightProps } from './CodeHighlight';
import React from 'react';
import { loader } from 'components/loader';

export let CodeHighlight = loader<CodeHighlightProps>({
    loadable: () => import(
        /* webpackChunkName: "core.components.code-highlight" */
        // /* webpackPrefetch: true */
        './CodeHighlight'
        ),
});

