import { EmojiProps } from './Emoji';
import { loader } from 'components/loader';

export let Emoji:loader.Class<EmojiProps> = loader(() => import(
    /* webpackChunkName: "core.components.emoji" */
    './Emoji'
    ),
);
