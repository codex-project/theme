import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu as AntdMenu } from 'antd';
import { observer } from 'mobx-react';
import { MenuProps as AntdMenuProps } from 'antd/es/menu';
import { MenuItemIcon } from './MenuItemIcon';
import { classes } from 'typestyle';
import { ClickParam } from 'antd/lib/menu';
import { transaction } from 'mobx';
import { getColor } from 'utils/colors';
import { MenuItems } from 'menus';

import { hot } from 'decorators';

const log = require('debug')('components:DynamicMenu');

const { Sider }                  = Layout;
const { SubMenu, Item, Divider } = AntdMenu;

export type MenuExpandBehaviourType = 'single-root' | 'multi-root'
export type MenuSelectBehaviourType = 'single' | 'multi'

export interface DynamicMenuBaseProps {
    items: MenuItems
    // iconStyle?: React.CSSProperties
    // fontSize?: number | string
    color?: string,
    renderer?: string
    multiroot?: boolean
    selectFromRoutePath?: boolean
}

interface State {
    openKeys: string[]
}

export type MenuItemRendererProps = DynamicMenuBaseProps & {
    [ key: string ]: any
    item: MenuItem
}

export type DynamicMenuProps = DynamicMenuBaseProps & AntdMenuProps

@hot(module)
@observer
export class DynamicMenu extends React.Component<DynamicMenuProps, State> {
    static displayName                                                        = 'DynamicMenu';
    static defaultProps: Partial<DynamicMenuBaseProps & AntdMenuProps>        = {
        prefixCls          : 'c-dmenu',
        mode               : 'horizontal',
        multiroot          : false,
        multiple           : false,
        selectFromRoutePath: true,

    };
    static renderers: Record<string, React.ComponentType<{ item: MenuItem }>> = {};
    static contextTypes                                                       = {
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

    onOpenChange = (openKeys: string[]) => transaction(() => {
        log('onOpenChange', openKeys);
        this.props.items.collapseAll().items(openKeys).expand();
    });

    onClick = (param: ClickParam) => transaction(() => {
        log('onClick', param);
        let { items } = this.props;
        let item      = items.item(param.key);
        items.handleClick(item, param.domEvent);
        if ( item.selected ) {
            if ( this.props.multiple === false ) {
                items.deselectAll().select(item);
            }
        } else {
            this.selectFromRoutePath();
        }

    });

    onTitleClick = (param: ClickParam) => transaction(() => {
        log('onTitleClick', param);
        let item = this.props.items.item(param.key);
        this.props.items.handleClick(item, param.domEvent);
    });

    renderMenuItem(item: MenuItem, level?: number) {
        const { color, mode, items } = this.props;
        const className              = `item-${item.type}`;

        switch ( item.type ) {
            case 'divider':
                return (<Divider key={item.id} className={className}>{mode === 'horizontal' ? '&nbsp' : null}</Divider>);
            case 'header':
                return (<Item key={item.id} className={className}><MenuItemIcon item={item}/><span>{item.label}</span></Item>);
            case 'sub-menu':
                return (
                    <SubMenu
                        className={className}
                        key={item.id}
                        title={<Fragment><MenuItemIcon item={item}/><span>{item.label}</span></Fragment>}
                        onTitleClick={this.onTitleClick}
                    >
                        {item.children.map(child => this.renderMenuItem(child, level + 1))}
                    </SubMenu>
                );
        }
        let renderer = this.props.renderer || item.renderer || 'default';
        if ( DynamicMenu.renderers[ renderer ] ) {
            const Component = DynamicMenu.renderers[ renderer ];
            let props       = { level, className, color };
            return <Component key={item.id} item={item} {...props || {}} />;
        }
        return null;
    }

    render() {
        const { children, className, multiple, multiroot, selectFromRoutePath, prefixCls, mode, items, color, renderer, ...props } = this.props;
        if ( typeof items.selected !== 'function' ) {
            return null;
        }
        const menuClassName = classes(className, prefixCls,
            `${prefixCls}-${mode}`,
            `${prefixCls}-theme-${mode}`,
        );
        return (
            <AntdMenu
                mode={mode}
                className={menuClassName}
                subMenuCloseDelay={0.6}
                style={{ backgroundColor: getColor(color) }}
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


export function MenuItemRenderer(name: string) {
    return (TargetComponent) => {
        // TargetComponent               = observer(TargetComponent);
        DynamicMenu.renderers[ name ] = TargetComponent;
        return TargetComponent;
    };
}
export default DynamicMenu
