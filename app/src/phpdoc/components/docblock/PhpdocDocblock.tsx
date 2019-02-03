import React from 'react';
import { observer } from 'mobx-react';
import { classes, style } from 'typestyle';
import { isString } from 'lodash';
import { getColor, hot, HtmlComponents, lazyInject, MaterialColor } from '@codex/core';
import { api } from '@codex/api';
import { Tags } from '../../logic';
import './docblock.scss';
import { PhpdocTags } from '../tags';

const log = require('debug')('components:PhpdocDocblock');

export interface PhpdocDocblockProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;

    boxed?: boolean

    docblock?: api.PhpdocDocblock

    size?: number
    tagSize?: number
    color?: MaterialColor
    tagColor?: MaterialColor
    withoutTags?: string[]
    onlyTags?: string[]
}

export { PhpdocDocblock };

@hot(module)
@observer
export default class PhpdocDocblock extends React.Component<PhpdocDocblockProps> {
    @lazyInject('components') hc: HtmlComponents;
    static displayName: string                        = 'PhpdocDocblock';
    static defaultProps: Partial<PhpdocDocblockProps> = {
        boxed      : false,
        size       : 11,
        tagSize    : 11,
        color      : 'green-8',
        tagColor   : 'green-8',
        withoutTags: [ 'param', 'example', 'return', 'inherited_from' ],
    };


    get docblock() { return this.props.docblock; }

    get tags(): Tags { return this.docblock.tags as any; }

    get hasLongDescription(): boolean { return isString(this.docblock.long_description) && this.docblock.long_description.length > 0; }

    render() {
        let { boxed, size, color, style }                = this.props;
        let { tagColor, tagSize, withoutTags, onlyTags } = this.props;
        let docblock                                     = this.docblock;
        if ( ! docblock ) {
            return null;
        }
        let { description, line, tags, long_description } = docblock;
        try {
            description = this.hc.parse(description) as any;
            if ( this.hasLongDescription ) {
                long_description = this.hc.parse(long_description) as any;
            }
        } catch ( e ) {

        }
        return (
            <div
                style={{ fontSize: size, color: getColor(color), ...style }}
                className={classes(...[ boxed ? 'boxed' : null ], 'phpdoc-docblock', this.props.className)}
            >
                <div
                    style={{ fontSize: size, color: getColor(color) }}
                    className={classes('phpdoc-docblock-description')}
                >
                    {description}
                    {this.hasLongDescription ? long_description : null}
                </div>
                <PhpdocTags size={tagSize} color={tagColor} tags={this.tags} withoutTags={withoutTags} onlyTags={onlyTags}/>
            </div>
        );
    }


    getClassName() { return classes(style(this.props.style), this.props.className); }
}
