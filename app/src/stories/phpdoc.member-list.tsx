import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, select } from '@storybook/addon-knobs';
import { withOutline, withPhpdocManifest } from './storybook.decorators';
import { PhpdocMemberList } from '@codex/phpdoc';

let fqsenList = [
    'Codex\\Codex',
    'Codex\\CodexServiceProvider',
    'Codex\\Projects\\Project',
];

storiesOf('phpdoc', module)
    .addDecorator(withPhpdocManifest)
    .addDecorator(withOutline)
    .addParameters({})
    .add('PhpdocMemberList', () => {
        return <PhpdocMemberList
            fqsen={select('fqsen', fqsenList, fqsenList[ 0 ])}
            filterable={boolean('filterable', false)}
            searchable={boolean('searchable', false)}
            selectable={boolean('selectable', false)}
            scrollToSelected={boolean('scrollToSelected', false)}
            clickableInherits={boolean('clickableInherits', false)}
            noHover={boolean('noHover', false)}
            height={number('height', 300)}

        />;
    });

