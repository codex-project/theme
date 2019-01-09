import React from 'react';
import { hot } from '../../decorators';
import { observer } from 'mobx-react';
import { strEnsureLeft } from '../../utils/general';
import { api } from '@codex/api';
import { classes } from 'typestyle';

const log = require('debug')('components:MenuItemIcon');

export interface MenuItemIconProps {
    item: api.MenuItem
    iconStyle?: React.CSSProperties
    fontSize?: string | number
    className?: string
}

interface State {}

@hot(module)
@observer
export class MenuItemIcon extends React.Component<MenuItemIconProps, State> {
    static displayName                              = 'MenuItemIcon';
    static defaultProps: Partial<MenuItemIconProps> = {};

    render() {
        let { item, className } = this.props;
        if ( ! item.icon ) {
            return null;
        }
        let { iconStyle, fontSize } = this.props;
        let icon                    = item.icon;
        icon                        = strEnsureLeft(icon, 'fa-');
        icon                        = strEnsureLeft(icon, 'fa ');

        return <i className={classes(icon, className)} style={{ ...iconStyle, fontSize }}/>;
    }

}
