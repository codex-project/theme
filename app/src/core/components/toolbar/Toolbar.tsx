import React from 'react';
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { Row } from 'antd/lib/grid';
import { classes } from 'typestyle';
import { strEnsureLeft } from 'utils/general';
import { getClassNamer } from 'utils/getClassNamer';

import './toolbar.scss';

export type ToolbarSize = 'small' | 'default' | 'large';

export interface ToolbarProps {
    prefixCls?: string
    className?: string
    style?: React.CSSProperties
    size?: ToolbarSize
    left?: React.ReactNode
    right?: React.ReactNode
}

const prefixCls  = 'c-toolbar';
const classNames = (...names: string[]) => classes(...names.filter(Boolean).map(name => strEnsureLeft(name, prefixCls + '-')));

@hot(module)
@observer
export class Toolbar extends React.Component<ToolbarProps> {
    static displayName                         = 'Toolbar';
    static defaultProps: Partial<ToolbarProps> = {
        size     : 'default',
        prefixCls: 'c-toolbar',
    };

    render() {
        let { children, className, style, size, left, right } = this.props;

        const cls = getClassNamer(this);

        return (
            <Row
                justify="space-between"
                align="middle"
                type="flex"
                className={cls.root({ sm: size === 'small', lg: size === 'large' })()}
                style={style}
            >
                {children}
            </Row>
        );
    }
}

