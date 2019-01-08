import { SpinProps as AntdSpinProps } from 'antd/es/spin';
import { Spin as AntdSpin } from 'antd';
// import { Icon, IconProps } from '../../components/icon';
import { hot } from '../../decorators';
import * as React from 'react';
import './index.scss';


export interface SpinProps extends AntdSpinProps {
    icon?: string
    iconStyle?: React.CSSProperties
}

@hot(module)
export class Spin extends React.PureComponent<SpinProps> {
    static displayName  = 'Spin';
    static defaultProps = {
        icon: 'circle-o-notch',
    };

    render() {
        const { icon, iconStyle, prefixCls, ...props } = this.props;
        return (
            <AntdSpin
                prefixCls="awesome-spin"
                indicator={<i
                    className={'fa fa-spin fa-3x fa-fw fa-' + icon}
                    style={iconStyle}
                />}
                {...props || {}}
            />
        );
    }
}
