import React from 'react';

import { hot } from 'decorators';
import { observer } from 'mobx-react';

import { Col, ColProps, Row } from 'antd/lib/grid';
import { classes } from 'typestyle';
import { Tunnel, TunnelPlaceholder } from '../tunnel';
import './toolbar.scss';
import { strEnsureLeft } from 'utils/general';
import { getClassNamer } from 'utils/getClassNamer';


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
const Spacer     = (props) => <div className={classNames('spacer')} style={{ flexGrow: 10 }}/>;
const Column     = (props: ColProps) => <Col className={classNames('column')} {...props} />;
const Item       = (props: { side: 'left' | 'right', children: React.ReactNode }) => {
    return (
        <Tunnel id={strEnsureLeft(props.side, 'toolbar-')}>
            {props.children}
        </Tunnel>
    );
};

@hot(module)
@observer
export class Toolbar extends React.Component<ToolbarProps> {
    static displayName                         = 'Toolbar';
    static defaultProps: Partial<ToolbarProps> = {
        size: 'default',
        prefixCls: 'c-toolbar'
    };
    static Spacer: typeof Spacer               = Spacer;
    static Column: typeof Column               = Column;
    static Item: typeof Item                   = Item;

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
                <Column>
                    {left ? left : <TunnelPlaceholder id="toolbar-left" delay={1500} multiple/>}
                </Column>
                <Spacer/>
                <Column>
                    {right ? right : <TunnelPlaceholder id="toolbar-right" delay={1500} multiple/>}
                </Column>
            </Row>
        );
    }
}

export default Toolbar;
