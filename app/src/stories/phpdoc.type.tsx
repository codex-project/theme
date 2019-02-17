import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import { withOutline, withPhpdocManifest } from './storybook.decorators';
import { PhpdocType } from '@codex/phpdoc';

let primitives = [ 'boolean', 'integer', 'float', 'string', 'array', 'object', 'callable', 'iterable', 'resource', 'null', 'mixed', 'void' ];
primitives     = primitives.concat(primitives.map(s => s + '[]'));
let entities   = [
    'Codex\\Codex',
    'Codex\\CodexServiceProvider',
    'Codex\\Projects\\Project',
    'Codex\\Contracts\\Projects\\Project',
];
entities.push(entities.reduce((prev, cur) => prev + '|' + cur));
entities.push(entities.map(s => s + '[]').reduce((prev, cur) => prev + '|' + cur));
entities  = entities.concat(entities.map(s => s + '[]'));
let types = [].concat(entities, primitives);

storiesOf('phpdoc', module)
    .addDecorator(withPhpdocManifest)
    .addDecorator(withOutline)
    .addParameters({})
    .add('PhpdocType', () => (
        <PhpdocType
            type={select('type', types, 'string')}
            noClick={boolean('noClick', false)}
            noLink={boolean('noLink', false)}
            showTooltip={boolean('showTooltip', false)}
            showNamespace={boolean('showNamespace', false)}
            showTooltipClick={boolean('showTooltipClick', false)}
            showTooltipIcon={boolean('showTooltipIcon', false)}
            seperator={text('seperator', ' | ')}
        />
    ));

