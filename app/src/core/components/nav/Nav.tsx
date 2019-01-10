import { hot } from 'decorators';
import React from 'react';
import { Menu, MenuItem, MenuItemProps, MenuMenu,Icon } from 'semantic-ui-react';
import { MenuItems, MenuManager } from 'menus';
import 'semantic-ui-less/definitions/collections/menu.less';
import 'semantic-ui-less/definitions/elements/icon.less';

import './index.scss';
import { MenuItem as IMenuItem } from '@codex/api';
import { lazyInject } from 'ioc';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

const log = require('debug')('NAv');

export interface NavProps {
    items: MenuItems
}

interface State {

}

@hot(module)
@observer
export class Nav extends React.Component<NavProps, State> {
    @lazyInject('menumanager') manager: MenuManager;
    static displayName       = 'Nav';
    static childContextTypes = { items: PropTypes.any };

    getChildContext() { return { items: this.props.items }; }

    onClick = (event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        this.props.items.handleClick(data.id, event);
    };

    renderMenuItem(item: IMenuItem) {
        let {icon}        = item;
        const itemProps = {
            className: 'c-nav-type-' + item.type,
            key      : item.id,
            id       : item.id,
        };
        if(icon){
            icon = icon.replace(/^(?:fa\sfa-|fa-)(.*)$/m, '$1').replace(/-/g,' ')
        }

        switch ( item.type ) {
            case 'sub-menu':
                return (
                    <MenuItem {...itemProps}>
                        {item.label}
                        <MenuMenu>
                            {item.children.map(child => this.renderMenuItem(child))}
                        </MenuMenu>
                    </MenuItem>
                );
        }

        log(item.label, icon)
        return (
            <MenuItem
                {...itemProps}
                active={item.selected}

                onClick={this.onClick}
            >
                {icon ? <Icon name={icon as any}/> : null }
                {item.label}
            </MenuItem>
        );
    }

    render() {
        if ( ! this.props || ! this.props.items ) return null;
        const { items } = this.props;

        return (
            <Menu
                icon="labeled"
            >
                {items.map(item => this.renderMenuItem(item))}
            </Menu>
        );
    }
}
