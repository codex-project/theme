import React from 'react';
import { hot } from 'decorators';
import { observer } from 'mobx-react';

import './index.scss';
import { Col, ColProps, Row } from 'antd/lib/grid';
import { classes } from 'typestyle';
import { strEnsureLeft } from 'utils/general';
import { Tunnel, TunnelPlaceholder } from 'components/tunnel';

export interface ToolbarProps {
    className?: string
    style?: React.CSSProperties
}

const prefixCls  = 'c-toolbar';
const classNames = (...names: string[]) => classes(...names.map(name => strEnsureLeft(name, prefixCls + '-')));
const Spacer     = (props) => <div className={classNames('spacer')} style={{ flexGrow: 10 }}/>;
const Column     = (props: ColProps) => <Col className={classNames('column')} {...props} />;
const Item       = (props: { side: 'left' | 'right', children: React.ReactNode }) => {
    return null;
    // return (
    //     <Tunnel id={strEnsureLeft(props.side, 'toolbar-')}>
    //         {props.children}
    //     </Tunnel>
    // );
};

@hot(module)
@observer
export class Toolbar extends React.Component<ToolbarProps> {
    static displayName                         = 'Toolbar';
    static defaultProps: Partial<ToolbarProps> = {};
    static Spacer: typeof Spacer               = Spacer;
    static Column: typeof Column               = Column;
    static Item: typeof Item                   = Item;

    render() {
        let { children, className, style } = this.props;

        return (
            <Row
                justify="space-between"
                align="middle"
                type="flex"
                className={classes(prefixCls, className)}
                style={style}
                gutter={24}
            >
                <Column>
                    {/*<TunnelPlaceholder id="toolbar-left" multiple/>*/}
                </Column>
                <Spacer/>
                <Column>
                    {/*<TunnelPlaceholder id="toolbar-right" multiple/>*/}
                </Column>
            </Row>
        );
    }
}
