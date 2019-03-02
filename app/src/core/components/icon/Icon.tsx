import React from 'react';

import { classes } from 'typestyle';
import { FontAwesomeIcon } from 'interfaces';
import { hot } from 'decorators';
import { strEnsureLeft } from 'utils/general';
import { getElementType } from 'utils/getElementType';

const log = require('debug')('components:Icon');

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
    as?:React.ReactType
    name: FontAwesomeIcon
    style?: React.CSSProperties
    className?: string
    fontSize?: string | number
    spin?: boolean
    fixedWidth?: boolean
    x1?: boolean
    x2?: boolean
    x3?: boolean
    x4?: boolean
    x5?: boolean
    flip?: 'horizontal' | 'vertical' | 'both' | false
    rotate?: '270' | '180' | '90' | false
}

interface State {}

@hot(module)
export class Icon extends React.PureComponent<IconProps, State> {
    static displayName                      = 'Icon';
    static defaultProps: Partial<IconProps> = {
        as:'i'
    };

    render() {
        let {
                name, style, fontSize, className,
                spin, fixedWidth, x1, x2, x3, x4, x5, flip, rotate,
                ...props
            } = this.props;

        name = strEnsureLeft(name, 'fa-') as any;
        name = strEnsureLeft(name, 'fa ') as any;

        let classNames = [
            name,
            className,
            spin && 'fa-spin',
            fixedWidth && 'fa-fw',
            x1 && 'fa-x1',
            x2 && 'fa-x2',
            x3 && 'fa-x3',
            x4 && 'fa-x4',
            x5 && 'fa-x5',
            (flip === 'horizontal' || flip === 'vertical') && 'fa-flip-' + flip,
            flip === 'both' && 'fa-flip-horizontal',
            flip === 'both' && 'fa-flip-vertical',
            rotate && 'fa-rotate-' + rotate.toString(),
        ].filter(Boolean);

        const ElementType:any = getElementType(Icon, this.props) as any;

        return <ElementType className={classes(...classNames)} style={{ fontSize, ...style }} {...props} />;
    }

}
