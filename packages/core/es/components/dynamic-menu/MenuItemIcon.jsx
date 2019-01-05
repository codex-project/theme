var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { strEnsureLeft } from 'utils/general';
import { classes } from 'typestyle';
const log = require('debug')('components:MenuItemIcon');
let MenuItemIcon = class MenuItemIcon extends React.Component {
    render() {
        let { item, className } = this.props;
        if (!item.icon) {
            return null;
        }
        let { iconStyle, fontSize } = this.props;
        let icon = item.icon;
        icon = strEnsureLeft(icon, 'fa-');
        icon = strEnsureLeft(icon, 'fa ');
        return <i className={classes(icon, className)} style={Object.assign({}, iconStyle, { fontSize })}/>;
    }
};
MenuItemIcon.displayName = 'MenuItemIcon';
MenuItemIcon.defaultProps = {};
MenuItemIcon = __decorate([
    hot(module),
    observer
], MenuItemIcon);
export { MenuItemIcon };
