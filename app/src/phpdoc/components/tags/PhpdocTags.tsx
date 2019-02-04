import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { CodeHighlight,getColor, hot, HtmlComponents, lazyInject, MaterialColor, strEnsureLeft } from '@codex/core';
import { classes } from 'typestyle';

import './tags.scss';
import { Tags } from '../../logic';
import { api } from '@codex/api';
import { PhpdocType } from '../type';

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

export { PhpdocTags };
@hot(module)
@observer
export default class PhpdocTags extends React.Component<PhpdocTagsProps> {
    @lazyInject('components') hc: HtmlComponents;
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
        return this.props.tags;
    }

    render() {
        const { style, className, prefixCls } = this.props;
        return (
            <div style={style} className={classes(prefixCls, className)}>
                {this.filteredTags.map((tag, index) => this.renderTag(tag, index))}
            </div>
        );
    }

    classNames = (...names: string[]) => {
        return classes(...names.filter(Boolean).map(name => strEnsureLeft(name, this.props.prefixCls + '-')));
    };

    renderTag(tag: api.PhpdocTag, i = null) {
        const { classNames }  = this;
        const { size, color } = this.props;

        return (
            <div className={classNames('tag')} key={i || tag.name + tag.line} style={{ fontSize: size, color: getColor(color) }}>
                <span className={classNames('tag-left')}>
                    <span className={classes('tag-at')}>@</span>
                    <span className={classes('tag-name')}>{tag.name}</span>
                </span>
                <span className={classNames('tag-right')}>
                    {this.renderTagContent(tag)}
                </span>
            </div>
        );
    }

    renderTagContent(tag: api.PhpdocTag) {
        const { classNames }                                                 = this;
        const { size, color }                                                = this.props;
        let { variable, refers, link, line, description, type, name, types } = tag;
        variable                                                             = <span className={classes('tag-variable')}>{variable}</span> as any;
        try {
            description = this.hc.parse(description) as any;
        } catch ( e ) {

        }
        description = <span className={classes('tag-description')}>{description}</span> as any;


        switch ( name ) {
            case 'example':
                return (
                    <CodeHighlight language="php" withLineNumbers code={tag.description}/>
                )
            case 'see':
                if ( link ) {
                    return (
                        <Fragment>
                            <PhpdocType type={link}/>
                            {description}
                        </Fragment>
                    );
                }
            case 'return':
            case 'throws':
                return (
                    <Fragment>
                        <PhpdocType type={types}/>
                        {description}
                    </Fragment>
                );
            case 'param':
                return (
                    <Fragment>
                        <PhpdocType type={types}/>
                        {variable}
                        {description}
                    </Fragment>
                );
        }
        return (
            <Fragment>
                {description}
                {link ? <a className={classes('tag-link')} href={link} target="_blank">{link}</a> : null}
                {refers ? <span className={classes('tag-refers')}>{refers}</span> : null}
            </Fragment>
        );
    }
}
