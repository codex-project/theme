import React from 'react';
import { componentLoader } from 'utils/componentLoader';
import { CodeHighlight as CodeHighlightClass } from 'components/code-highlight/CodeHighlight';


export const CodeHighlight = componentLoader<typeof CodeHighlightClass>(
    async () => (await import(/* webpackChunkName: "core.components.code-highlight" */'./CodeHighlight')).CodeHighlight,
    (CodeHighlight, props) => <CodeHighlight {...props} />,
    { delay: 1000 },
);


