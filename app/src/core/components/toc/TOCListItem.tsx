import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {scrollTo} from 'utils/scroll'
import { hot } from 'react-hot-loader';
import { lazyInject } from 'ioc';
import { classes } from 'typestyle';
import { strEnsureLeft } from 'utils/general';
import { getElementType } from 'utils/getElementType';
import './toc.scss'

const log = require('debug')('components:TOC');

export interface TOCListItemProps {
    as?:React.ReactType
    href: string
    title: string
    className?: string
    style?: React.CSSProperties
}

export type TOCListItemComponent = React.ComponentType<TOCListItemProps>

@hot(module)
@observer
export default class TOCListItem extends Component<TOCListItemProps> {
    static displayName: string                     = 'TOCListItem';
    static defaultProps: Partial<TOCListItemProps> = {
        as:'li'
    };

    @lazyInject('history') protected history: History;

    onClick = e => {
        e.preventDefault();
        // e.stopPropagation();
        scrollTo(strEnsureLeft(this.props.href, '#'));
    };

    render() {
        const { className, style, children, href, title } = this.props;
        const ElementType = getElementType(TOCListItem, this.props);
        return (
            <ElementType style={style} className={classes('c-toc-list-item', className)}>
                <a href={strEnsureLeft(href, '#')} onClick={this.onClick}>
                    <span className="title">{title}</span>
                </a>
                {children || null}
            </ElementType>
        );
    }

}
