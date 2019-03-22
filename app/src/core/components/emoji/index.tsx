import { EmojiProps } from './Emoji';
import { loader } from 'components/loader';

export let Emoji = loader<EmojiProps>(() => import(
    /* webpackChunkName: "core.components.emoji" */
    './Emoji'
    ),
);
