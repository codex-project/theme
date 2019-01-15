import React from 'react';
import { hot } from '../decorators';
import { strEnsureLeft } from '../utils/general';
import { classes } from 'typestyle';
import { FontAwesomeIcon } from 'interfaces';

const log = require('debug')('components:Icon');

export interface IconProps extends React.HTMLAttributes<HTMLElement>{
    name: FontAwesomeIcon
    style?: React.CSSProperties
    className?: string
    fontSize?: string | number
}

interface State {}

@hot(module)
export class Icon extends React.PureComponent<IconProps, State> {
    static displayName                      = 'Icon';
    static defaultProps: Partial<IconProps> = {};

    render() {
        let { name, style, fontSize, className, ...props } = this.props;
        let icon                                 = name as string;
        icon                                     = strEnsureLeft(icon, 'fa-');
        icon                                     = strEnsureLeft(icon, 'fa ');

        return <i className={classes(icon, className)} style={{ fontSize, ...style }} {...props} />;
    }

}
