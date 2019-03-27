import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import { classes } from 'typestyle';
import { getElementType } from 'utils/getElementType';
import './toc.scss'

const log = require('debug')('components:TOC');

export interface TOCListProps {
    as?: React.ReactType
    className?: string
    style?: React.CSSProperties
}

export type TOCListComponent = React.ComponentType<TOCListProps>



@hot(module)
@observer
export  class TOCList extends Component<TOCListProps> {
    static displayName: string                 = 'TOCList';
    static defaultProps: Partial<TOCListProps> = {
        as: 'ul',
    };

    render() {
        const { className, style, children } = this.props;

        const ElementType = getElementType(TOCList, this.props);
        return (
            <ElementType style={style} className={classes('c-toc-list', className)}>
                {children}
            </ElementType>
        );
    }

}
