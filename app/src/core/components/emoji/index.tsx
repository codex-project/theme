import React, { ComponentType } from 'react';
import loadable from '@loadable/component';

import { EmojiProps } from './Emoji';
export type EmojiComponent = ComponentType<EmojiProps> & {}
export let Emoji: EmojiComponent = loadable(() => import(
    /* webpackChunkName: "core.components.emoji" */
    './Emoji'
    ),
);
