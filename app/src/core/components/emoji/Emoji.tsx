import React, { Component, Fragment } from 'react';
// noinspection ES6UnusedImports
import EmojiRender, { Emojione, Props, Twemoji } from 'react-emoji-render';
import { strEnsureLeft, strEnsureRight } from 'utils/general';
import classnames from 'classnames';

export interface EmojiProps {
    name: string
    type?: 'native' | 'twemoji' | 'emojione'
    className?: string
    style?: React.CSSProperties
    /** On the format WxH, like `72x72`. */
    svg?: boolean
}

export class Emoji extends Component<EmojiProps> {
    static displayName                       = 'Emoji';
    static defaultProps: Partial<EmojiProps> = {
        type: 'twemoji',
    };

    render() {
        let { children, type, name, className, style, svg, ...props } = this.props;
        name                                                          = strEnsureRight(strEnsureLeft(name, ':'), ':');
        let classNames                                                = [
            'c-emoji',
            className,
        ];
        let emojiProps: Props & { style?: React.CSSProperties }       = {
            text     : name,
            className: classnames(classNames),
            style,
            svg,
        };

        return (
            <Fragment>
                <If condition={type === 'native'}>
                    <EmojiRender {...emojiProps} />
                </If>
                <If condition={type === 'twemoji'}>
                    <Twemoji {...emojiProps} />
                </If>
                <If condition={type === 'emojione'}>
                    <Emojione {...emojiProps}/>
                </If>
            </Fragment>
        );
    }
}

export default Emoji;
