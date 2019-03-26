import { SpinProps as AntdSpinProps } from 'antd/es/spin';
import { Spin as AntdSpin } from 'antd';
import { hot } from 'react-hot-loader';
import React from 'react';
import './index.scss';
import { Icon } from '../icon';
import { FontAwesomeIcon } from 'interfaces';

// import { Icon, IconProps } from '../../components/icon';


export interface SpinProps extends AntdSpinProps {
    icon?: FontAwesomeIcon
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
        const oldIndicator                             = <i
            className={'fa fa-spin fa-3x fa-fw fa-' + icon}
            style={iconStyle}
        />;

        const indicator = <Icon
            spin fixedWidth x3
            name={icon}
            style={iconStyle}
        />;
        return (
            <AntdSpin
                prefixCls="awesome-spin"
                indicator={indicator}
                {...props}
            />
        );
    }
}
