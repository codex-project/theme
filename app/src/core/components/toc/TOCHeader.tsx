import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { classes } from 'typestyle';
import { hot } from 'react-hot-loader';
import { strEnsureLeft } from 'utils/general';
import './toc.scss'

const log = require('debug')('components:TOC');

export interface TOCHeaderProps {
    size: string | number
    title: string
    slug: string
    linkClassName?: string
    className?: string
    style?: React.CSSProperties
}

export type TOCHeaderComponent = React.ComponentType<TOCHeaderProps>

@hot(module)
@observer
export class TOCHeader extends Component<TOCHeaderProps> {
    static displayName: string                   = 'TOCHeader';
    static defaultProps: Partial<TOCHeaderProps> = {
        linkClassName: 'c-toc-header-link',
    };

    onLinkClick = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    render() {
        const { className, style, children, size, title, slug, linkClassName } = this.props;

        return React.createElement(`h${size}`, {
            key      : slug,
            id       : slug,
            className: classes('c-toc-header', className),
            style,
        }, [
            <span key="span">{title}</span>,
            <a key="link" href={strEnsureLeft(slug, '#')} className={linkClassName} onClick={this.onLinkClick}>#</a>,
        ]);

    }

}
