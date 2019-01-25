import React from 'react';

import { hot } from 'decorators';
import { observer } from 'mobx-react';

import { Col, ColProps, Row } from 'antd/lib/grid';
import { classes } from 'typestyle';
import { Tunnel, TunnelPlaceholder } from '../tunnel';
import './toolbar.scss';
import { strEnsureLeft } from 'utils/general';


export type ToolbarSize = 'small' | 'default' | 'large';

export interface ToolbarProps {
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
    };
    static Spacer: typeof Spacer               = Spacer;
    static Column: typeof Column               = Column;
    static Item: typeof Item                   = Item;

    render() {
        let { children, className, style, size, left, right } = this.props;

        return (
            <Row
                justify="space-between"
                align="middle"
                type="flex"
                className={classes(prefixCls, classNames(size !== 'default' ? size === 'small' ? 'sm' : 'lg' : null), className)}
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
