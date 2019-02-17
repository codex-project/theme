import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import { withOutline, withPhpdocManifest } from './storybook.decorators';
import { PhpdocMethodSignature } from '@codex/phpdoc';

let fqsenList = [
    'Codex\\Codex::get()',
    'Codex\\CodexServiceProvider::register()',
    'Codex\\Projects\\Project::url()',
];

storiesOf('phpdoc', module)
    .addDecorator(withPhpdocManifest)
    .addDecorator(withOutline)
    .addParameters({})
    .add('PhpdocMethodSignature', () => {
        return <PhpdocMethodSignature
            fqsen={select('fqsen', fqsenList, fqsenList[ 0 ])}
            noClick={boolean('noClick', false)}
            inline={boolean('inline', false)}
            link={boolean('link', false)}
            size={number('size', 14)}
            returnCharacter={text('returnCharacter', '=>')}
            hide={{
                inherited       : boolean('inherited', false),
                deprecated      : boolean('deprecated', false),
                modifiers       : boolean('modifiers', false),
                arguments       : boolean('arguments', false),
                argumentTypes   : boolean('argumentTypes', false),
                argumentDefaults: boolean('argumentDefaults', false),
                returns         : boolean('returns', false),
                namespace       : boolean('namespace', false),
                typeTooltip     : boolean('typeTooltip', false),
                typeTooltipClick: boolean('typeTooltipClick', false),
            }}
        />;
    });

