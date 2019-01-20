import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { hot } from 'decorators';
import { strEnsureLeft } from 'utils/general';
import { scrollTo } from 'utils/scrollTo';
import { classes } from 'typestyle';


const log = require('debug')('components:TOC');

export interface TOCListItemProps {
    href: string
    title: string
    className?: string
    style?: React.CSSProperties
}

export type TOCListItemComponent = React.ComponentType<TOCListItemProps>

/**
 * TOC component
 */
@hot(module)
@observer
export class TOCListItem extends Component<TOCListItemProps> {
    static displayName: string                     = 'TOCListItem';
    static defaultProps: Partial<TOCListItemProps> = {};

    @lazyInject('history') protected history: History;

    onClick = e => {
        e.preventDefault();
        // e.stopPropagation();
        scrollTo(strEnsureLeft(this.props.href, '#'));
    };

    render() {
        const { className, style, children, href, title } = this.props;

        return (
            <li style={style} className={classes('c-toc-list-item', className)}>
                <a href={strEnsureLeft(href, '#')} onClick={this.onClick}>
                    <span className="title">{title}</span>
                </a>
                {children || null}
            </li>
        );
    }

}
