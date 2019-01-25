import React from 'react';
import { CodeHighlight as CodeHighlightClass, CodeHighlightProps } from './CodeHighlight';
import { componentLoader } from 'utils/componentLoader';


export const CodeHighlight:React.ComponentType<CodeHighlightProps> = componentLoader<typeof CodeHighlightClass>(
    async () => (await import(/* webpackChunkName: "core.components.code-highlight" */'./CodeHighlight')).CodeHighlight,
    (CodeHighlight, props) => <CodeHighlight {...props} />,
    { delay: 1000 },
);


