import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select } from '@storybook/addon-knobs';
import { withOutline, withPhpdocManifest } from './storybook.decorators';
import { PhpdocEntity } from '@codex/phpdoc';

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
    .add('PhpdocEntity', () => {
        let hides       = {
            icon      : boolean('hide.icon', false),
            implements: boolean('hide.implements', false),
            extends   : boolean('hide.extends', false),
        };
        let hide: any[] = Object.keys(hides).filter(key => hides[ key ] === true);
        return <PhpdocEntity
            fqsen={select('fqsen', fqsenList, fqsenList[ 0 ])}
            noClick={boolean('noClick', false)}
            noLink={boolean('noLink', false)}
            showTooltip={boolean('showTooltip', false)}
            showNamespace={boolean('showNamespace', false)}
            showTooltipClick={boolean('showTooltipClick', false)}
            showTooltipIcon={boolean('showTooltipIcon', false)}
            hide={hide}
        />;
    });

