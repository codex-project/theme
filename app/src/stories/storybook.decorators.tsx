import { makeDecorator } from '@storybook/addons';
import React from 'react';
import { ManifestProvider } from '@codex/phpdoc';

export const withPhpdocManifest = makeDecorator({
    name         : 'withPhpdocManifest',
    parameterName: 'phpdocManifest',
    wrapper      : (getStory, context, optsAndParams) => {
        // optsAndParams.options.
        return <ManifestProvider project="codex" revision="master">{getStory(context)}</ManifestProvider>;
    },
});

export const withOutline = makeDecorator<'outline', {}, React.CSSProperties>({
    name         : 'withOutline',
    parameterName: 'outline',
    wrapper      : (getStory, context, optsAndParams) => {
        let style = {
            padding: 20,
            margin : 20,
            border : '2px solid #CCC',
            ...optsAndParams.parameters || {},
        };
        return <div style={style}>{getStory(context)}</div>;
    },
});
