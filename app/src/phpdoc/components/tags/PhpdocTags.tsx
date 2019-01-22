import React from 'react';
import { observer } from 'mobx-react';
import { MaterialColor, strEnsureLeft } from '@codex/core';
import { classes } from 'typestyle';

import './tags.scss';
import { Tags } from '../../logic';
import { api } from '@codex/api';

const log = require('debug')('components:PhpdocTags');

export interface PhpdocTagsProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;
    prefixCls?: string
    tags: Tags
    size?: number
    color?: MaterialColor
    withoutTags?: string[]
    onlyTags?: string[]
}

@observer
export class PhpdocTags extends React.Component<PhpdocTagsProps> {
    static displayName: string                    = 'PhpdocTags';
    static defaultProps: Partial<PhpdocTagsProps> = {
        size     : 11,
        prefixCls: 'phpdoc-tags',
    };

    get filteredTags(): Tags {
        const { onlyTags, withoutTags } = this.props;
        if ( onlyTags && onlyTags.length > 0 ) {
            return this.props.tags.whereIn('name', onlyTags);
        }
        if ( withoutTags && withoutTags.length > 0 ) {
            return this.props.tags.whereNotIn('name', withoutTags);
        }
    }

    render() {
        const { style, className, prefixCls } = this.props;
        return (
            <div style={style} className={classes(prefixCls, className)}>
                {this.filteredTags.map(tag => this.renderTag(tag))}
            </div>
        );
    }

    classNames = (...names: string[]) => {
        return classes(...names.filter(Boolean).map(name => strEnsureLeft(name, this.props.prefixCls + '-')));
    };

    renderTag(tag: api.PhpdocTag) {
        const { classNames }                                                   = this;
        const { size, color }                                                  = this.props;
        const { variable, refers, link, line, description, type, name, types } = tag;

        // let styles = {
        //     container  : style({
        //         fontSize: this.size,
        //         color   : this.color
        //     }),
        //     colLeft    : style({
        //         minWidth: '100px'
        //     }),
        //     at         : style({
        //         fontWeight  : 'bold',
        //         paddingRight: '0 !important'
        //     }),
        //     name       : style({
        //         fontWeight: 'bold'
        //     }),
        //     refers     : style({}),
        //     link       : style({
        //         fontWeight: 'bold'
        //
        //     }),
        //     line       : style({}),
        //     description: style({}),
        //     type       : style({}),
        //     each       : style({
        //         paddingRight: '2px'
        //     }),
        //     hide       : style({})
        // }

        // log('i', i, 'name', tag.name, 'desc', tag.description)

        return (
            <div className={classNames('tag')} key={tag.name + tag.line}>
                <span className={classNames('tag-left')}>
                    <span className={classes('tag-at')}>@</span>
                    <span className={classes('tag-name')}>{name}</span>
                </span>
                <span className={classNames('tag-right')}>
                    <span className={classes('tag-description')}>{description}</span>
                    <a className={classes('tag-link')} href={link} target="_blank">{link}</a>
                    <span className={classes('tag-refers')}>{refers}</span>
                </span>
            </div>
        );
    }

}
