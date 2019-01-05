import React from 'react';
import { hot } from '../../decorators';
import PropTypes from 'prop-types';
import { Layout, Menu as AntdMenu } from 'antd';
import { observer } from 'mobx-react';
import { api } from '@codex/api';
import { MenuProps as AntdMenuProps } from 'antd/es/menu';
import { getColor } from '../../utils/colors';
import { MenuItemIcon } from './MenuItemIcon';
import { classes } from 'typestyle';
import { MenuItems } from '../../menus';
import { ClickParam } from 'antd/lib/menu';

const log = require('debug')('components:DynamicMenu');

const { Sider }                  = Layout;
const { SubMenu, Item, Divider } = AntdMenu;

export type MenuExpandBehaviourType = 'single-root' | 'multi-root'
export type MenuSelectBehaviourType = 'single' | 'multi'

export interface DynamicMenuProps {
    items: MenuItems
    iconStyle?: React.CSSProperties
    fontSize?: number | string
    color?: string,
    renderer?: string
    rendererMaxLevel?: number
    multiroot?: boolean
    selectFromRoutePath?: boolean
}

interface State {
    items: MenuItems
    openKeys: string[]
    idstring: string
}

export function MenuItemRenderer(name: string) {
    return (TargetComponent) => {
        DynamicMenu.renderers[ name ] = TargetComponent;
        return TargetComponent;
    };
}

export type MenuItemRendererProps= DynamicMenuProps & {
    [ key: string ]: any
    item: api.MenuItem
}

@hot(module)
@observer
export class DynamicMenu extends React.Component<DynamicMenuProps & AntdMenuProps, State> {
    static displayName                                                            = 'DynamicMenu';
    static defaultProps: Partial<DynamicMenuProps & AntdMenuProps>                = {
        iconStyle          : { paddingRight: 20 },
        fontSize           : 12,
        renderer           : 'default',
        prefixCls          : 'c-dmenu',
        mode               : 'horizontal',
        rendererMaxLevel   : 0,
        multiroot          : false,
        multiple           : false,
        selectFromRoutePath: true,

    };
    static renderers: Record<string, React.ComponentType<{ item: api.MenuItem }>> = {};
    static contextTypes                                                           = {
        siderCollapsed: PropTypes.bool,
        collapsedWidth: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    };
    context: { siderCollapsed: boolean, collapsedWidth: number | string };


    componentDidMount() {
        this.selectFromRoutePath();
    }

    componentWillReceiveProps(nextProps) {
        if ( this.props.items !== nextProps.items ) {
            this.selectFromRoutePath(nextProps.items);
        }
    }

    selectFromRoutePath(items: MenuItems = this.props.items) {
        if ( this.props.selectFromRoutePath ) {
            items.deselectAll();
            items.selectActiveFromRoute(true, ! this.props.multiroot);
        }
    }

    onOpenChange = (openKeys: string[]) => {
        log('onOpenChange', openKeys);
    };

    onClick = (param: ClickParam) => {
        log('onClick', param);
        let { items } = this.props;
        let item      = items.item(param.key);
        items.handleClick(item, param.domEvent);
        if ( item.selected ) {
            if ( this.props.multiple === false ) {
                items.deselectAll().select(item)
            }
        } else {
            this.selectFromRoutePath();
        }
    };

    onTitleClick = (param: ClickParam) => {
        log('onTitleClick', param);
        let item = this.props.items.item(param.key);
        this.props.items.handleClick(item, param.domEvent);
    };

    renderMenuItem(item: api.MenuItem, level?: number) {
        const { fontSize, iconStyle, color, mode, items } = this.props;
        const className                                   = `item-${item.type}`;

        // if ( level === 0 && ! item.icon ) {
        //     item.icon = 'caret-right';
        // }
        switch ( item.type ) {
            case 'divider':
                return (<Divider key={item.id} className={className}>{mode === 'horizontal' ? '&nbsp' : null}</Divider>);
            case 'header':
                return (<Item key={item.id} className={className}><MenuItemIcon item={item} iconStyle={iconStyle} fontSize={fontSize}/>{item.label}</Item>);
            case 'sub-menu':
                return (
                    <SubMenu
                        className={className}
                        key={item.id}
                        title={<span style={{ fontSize, paddingRight: iconStyle.paddingRight }}><MenuItemIcon item={item} iconStyle={iconStyle} fontSize={fontSize}/> {item.label}</span>}
                        onTitleClick={this.onTitleClick}
                    >
                        {item.children.map(child => this.renderMenuItem(child, level + 1))}
                    </SubMenu>
                );
        }
        let renderer = this.props.renderer;
        if ( level > this.props.rendererMaxLevel ) {
            renderer = 'default';
        }
        if ( DynamicMenu.renderers[ renderer ] ) {
            const Component = DynamicMenu.renderers[ renderer ];
            let props       = { level, className, fontSize, iconStyle, color };
            return <Component key={item.id} item={item} {...props || {}} />;
        }
        return null;
    }

    render() {
        const { children, className, multiple, multiroot, selectFromRoutePath, prefixCls, mode, fontSize, iconStyle, items, color, renderer, rendererMaxLevel, ...props } = this.props;

        if ( typeof items.selected !== 'function' ) {
            return null;
        }

        // log('render', { items, selected: items.selected().ids(), expanded: items.expanded().ids() });

        const menuClassName = classes(className, prefixCls,
            `${prefixCls}-${mode}`,
            `${prefixCls}-theme-${mode}`,
        );
        return (
            <AntdMenu
                mode={mode}
                className={menuClassName}
                subMenuCloseDelay={0.6}
                style={{ fontSize, backgroundColor: getColor(color) }}
                selectedKeys={items.selected().ids()}
                openKeys={items.expanded().ids()}
                onClick={this.onClick}
                onOpenChange={this.onOpenChange}
                multiple={multiple}
                {...props}
            >
                {items.map(item => this.renderMenuItem(item, 0))}
            </AntdMenu>
        );
    }
}
