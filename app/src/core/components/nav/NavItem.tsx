import { hot } from 'decorators';
import React from 'react';
import { MenuItem, MenuItemProps,MenuMenu } from 'semantic-ui-react';
import { MenuItem as IMenuItem, MenuItems } from 'menus';
import 'semantic-ui-less/definitions/collections/menu.less';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';


export interface NavItemProps {
    item: IMenuItem

}

@hot(module)
@observer
export class NavItem extends React.Component<NavItemProps> {
    static displayName  = 'NavItem';
    static contextTypes = { items: PropTypes.any };
    context: { items: MenuItems };

    onClick = (event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => {
        this.context.items.handleClick(this.props.item, event);
    };

    render() {
        const { items }                                           = this.context;
        const { children, item, label, type, selected, expanded } = this.props;

        switch(item.type){
            case 'sub-menu':
                return (

                    <MenuItem>
                        <MenuMenu>

                        </MenuMenu>
                    </MenuItem>
                );
        }
        return (
            <MenuItem
                key={item.id}
                active={item.selected}
                icon={item.icon}
                onClick={this.onClick}
            >
                {children}
            </MenuItem>
        );
    }
}
