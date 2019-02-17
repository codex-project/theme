import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select } from '@storybook/addon-knobs';
import { withOutline, withPhpdocManifest } from './storybook.decorators';
import { PhpdocMethod } from '@codex/phpdoc';

let fqsenList = [
    'Codex\\Codex::get()',
    'Codex\\CodexServiceProvider::register()',
    'Codex\\Projects\\Project::url()',
];

storiesOf('phpdoc', module)
    .addDecorator(withPhpdocManifest)
    .addDecorator(withOutline)
    .addParameters({})
    .add('PhpdocMethod', () => {
        return <PhpdocMethod
            fqsen={select('fqsen', fqsenList, fqsenList[ 0 ])}
            collapsible={boolean('collapsible', true)}
            collapsed={boolean('collapsed', false)}
            boxed={boolean('boxed', true)}
            hide={{
                signature       : boolean('hide.signature', false),
                details         : boolean('hide.details', false),
                description     : boolean('hide.description', false),
                example         : boolean('hide.example', false),
                tags            : boolean('hide.tags', false),
                inherited       : boolean('hide.inherited', false),
                modifiers       : boolean('hide.modifiers', false),
                arguments       : boolean('hide.arguments', false),
                argumentTypes   : boolean('hide.argumentTypes', false),
                argumentDefaults: boolean('hide.argumentDefaults', false),
                returns         : boolean('hide.returns', false),
                namespace       : boolean('hide.namespace', true),
                typeTooltip     : boolean('hide.typeTooltip', false),
                typeTooltipClick: boolean('hide.typeTooltipClick', false),
            }}
        />;
    });

