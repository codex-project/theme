import React from 'react';
import { hot } from 'decorators';

import './toolbar.scss';
import { Button as AntdButton } from 'antd';
import { Icon } from 'components/Icon';
import { ButtonType as AntdButtonType } from 'antd/lib/button';
import { FontAwesomeIcon, Omit } from 'interfaces';
import { NativeButtonProps } from 'antd/lib/button/button';
import { classes } from 'typestyle';

export type ButtonType = AntdButtonType|'codex' | 'codex-alt' |'toolbar';

export interface ButtonProps extends Partial<Omit<NativeButtonProps, 'type' | 'icon'>> {
    icon?: FontAwesomeIcon
    type?: ButtonType
    borderless?: boolean
}

@hot(module)
export class Button extends React.Component<ButtonProps> {
    static displayName                    = 'Button';
    static defaultProps:Partial<ButtonProps>={
        htmlType: 'button'
    }
    static Group: typeof AntdButton.Group = AntdButton.Group;

    render() {
        let { borderless, icon, children,className, ...props } = this.props;
        let classNames                               = [className];
        if ( borderless ) classNames.push('ant-btn-borderless');

        return (
            <AntdButton className={classes(...classNames)} {...props as any}>
                <If condition={icon}>
                    <Icon name={icon}/>
                </If>
                {children}
            </AntdButton>
        );
    }
}
