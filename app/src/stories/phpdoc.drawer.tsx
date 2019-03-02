import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select } from '@storybook/addon-knobs';
import { withOutline, withPhpdocManifest } from './storybook.decorators';
import { PhpdocDrawer } from '@codex/phpdoc';

let fqsenList = [
    'Codex\\Codex',
    'Codex\\CodexServiceProvider',
    'Codex\\Projects\\Project',
    'Codex\\Contracts\\Projects\\Project',
    'Codex\\Codex::get()',
    'Codex\\CodexServiceProvider::$config',
];

storiesOf('phpdoc', module)
    .addDecorator(withPhpdocManifest)
    .addDecorator(withOutline)
    .addParameters({})
    .add('PhpdocDrawer', () => {

        return <PhpdocDrawer   />;
    });

