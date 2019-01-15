import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { classes } from 'typestyle';
import { Button } from 'antd';
import { observable } from 'mobx';



const log = require('debug')('components:TOC')

export interface TOCProps {
    className?: string
    style?: React.CSSProperties
}
export type TOCComponent = React.ComponentType<TOCProps>


/**
 * TOC component
 */
@hot(module)
@observer
export class TOC extends Component<TOCProps> {
    static displayName: string                 = 'TOC'
    static defaultProps: Partial<TOCProps> = {}

    @observable show:boolean=false

    render() {
        const {className,style,children} = this.props;

        return (
            <Button htmlType="button" icon="plus">Table of Contents</Button>
        )
    }

}
