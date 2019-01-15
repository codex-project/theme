import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { classes } from 'typestyle';


const log = require('debug')('components:TOC');

export interface TOCListProps {
    className?: string
    style?: React.CSSProperties
}

export type TOCListComponent = React.ComponentType<TOCListProps>


/**
 * TOC component
 */
@hot(module)
@observer
export class TOCList extends Component<TOCListProps> {
    static displayName: string                 = 'TOCList';
    static defaultProps: Partial<TOCListProps> = {};

    render() {
        const { className, style, children } = this.props;

        return (
            <ul style={style} className={classes('c-toc-list', className)}>
                {children}
            </ul>
        );
    }

}
