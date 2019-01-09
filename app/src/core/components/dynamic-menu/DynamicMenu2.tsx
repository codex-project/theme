import React from 'react';
import { hot } from '../../decorators';
import PropTypes from 'prop-types';
import { Layout, Menu as AntdMenu } from 'antd';
import { observer } from 'mobx-react';
import { IMenuItemItems, MenuItem, MenuManager } from '../../menus';
import { MenuProps as AntdMenuProps } from 'antd/es/menu';
import { getColor } from '../../utils/colors';
import { MenuItemIcon } from './MenuItemIcon';
import { classes } from 'typestyle';
import { ClickParam } from 'antd/lib/menu';
import { transaction } from 'mobx';
import { DynamicMenu } from './DynamicMenu';
import memoize from 'memoize-one';
import { lazyInject } from 'ioc';
import { api } from '@codex/api';
import { ArrayUtils } from 'collections/ArrayUtils';
import { getActiveFromRoutePath } from 'utils/menus';

const log = require('debug')('components:DynamicMenu2');

const { Sider }                  = Layout;
const { SubMenu, Item, Divider } = AntdMenu;

export type MenuExpandBehaviourType = 'single-root' | 'multi-root'
export type MenuSelectBehaviourType = 'single' | 'multi'

export interface DynamicMenu2Props {
    items: any[]
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
    menu: MenuItems
}


@hot(module)
@observer
export class DynamicMenu2 extends React.Component<DynamicMenu2Props & AntdMenuProps, State> {
    static displayName                                                        = 'DynamicMenu2';
    static defaultProps: Partial<DynamicMenu2Props & AntdMenuProps>           = {
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
    static renderers: Record<string, React.ComponentType<{ item: MenuItem }>> = {};
    static contextTypes                                                       = {
        siderCollapsed: PropTypes.bool,
        collapsedWidth: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    };
    context: { siderCollapsed: boolean, collapsedWidth: number | string };

    state    = { menu: new MenuItems, items: new MenuItems };
    setItems = memoize((propItems: MenuItem[], menu: MenuItems) => menu.setItems(propItems));

    componentDidMount() {
        this.state.menu.onUpdate(() => {
            this.setState({ items: this.state.menu });
        });
    }

    componentWillReceiveProps(nextProps) {
        // this.setState({ items: MenuItems.from(nextProps.items) });
    }

    onOpenChange = (openKeys: string[]) => transaction(() => {
        log('onOpenChange', openKeys);
        this.state.menu.collapseAll().items(openKeys).expand();
    });

    onClick = (param: ClickParam) => transaction(() => {
        log('onClick', param);
        let { menu } = this.state;
        let item     = menu.item(param.key);
        menu.handleClick(item, param.domEvent);
        if ( item.selected ) {
            if ( this.props.multiple === false ) {
                menu.deselectAll().select(item);
            }
        } else {
            // this.selectFromRoutePath();
        }

    });

    onTitleClick = (param: ClickParam) => transaction(() => {
        log('onTitleClick', param);
        let item = this.state.menu.item(param.key);
        this.state.menu.handleClick(item, param.domEvent);
    });

    render() {
        if ( ! this.state ) return null;
        let items                                                                                                                                                  = this.setItems(this.props.items, this.state.menu);
        const { menu }                                                                                                                                             = this.state;
        const { children, className, multiple, multiroot, selectFromRoutePath, prefixCls, mode, fontSize, iconStyle, color, renderer, rendererMaxLevel, ...props } = this.props;

        if ( typeof menu.selected !== 'function' ) {
            return null;
        }

        log('render');


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
                selectedKeys={menu.selected().ids()}
                openKeys={menu.expanded().ids()}
                onClick={this.onClick}
                onOpenChange={this.onOpenChange}
                multiple={multiple}
                {...props}
            >
                {items.map(item => this.renderMenuItem(item, 0))}
            </AntdMenu>
        );
    }

    renderMenuItem(item: MenuItem, level?: number) {
        const { fontSize, iconStyle, color, mode } = this.props;
        const className                            = `item-${item.type}`;

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
}

export class MenuItems<T extends api.MenuItem = api.MenuItem> extends Array<T> implements Array<T> {
    @lazyInject('menumanager') manager: MenuManager;

    _updateCallbacks = [];

    onUpdate(cb) {
        this._updateCallbacks.push(cb);
        return this;
    }

    update() {
        this._updateCallbacks.forEach(cb => cb.call(this));
        return this;
    }

    transaction(action: Function) {
        action();
        this.update();
        return this;
    }

    setItems(items) {
        while ( this.length ) {
            this.pop();
        }
        this.push(...items);
        this.update();
        return this;
    }

    constructor(...items: T[]) {
        super(...items);
        Object.setPrototypeOf(this, MenuItems.prototype);
    }

    static from(items: any[]): MenuItems {
        let menu = new MenuItems();
        menu.push(...items);
        return menu;
    }

    first() { return this[ 0 ]; }

    last() { return this[ this.length - 1 ]; }

    findBy(key: keyof T, value: any): T | undefined { return this.rfind(item => item[ key ] === value); }

    where(key: keyof T, value: any): MenuItems<T> { return this.rfilter(item => item[ key ] === value); }

    whereNot(key: keyof T, value: any): MenuItems<T> { return this.rfilter(item => item[ key ] !== value); }

    rfilter(predicate: (value: T, index: number, obj: T[]) => boolean): MenuItems<T> { return new MenuItems(...ArrayUtils.rfilter(this, predicate)); }

    rfind(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined { return ArrayUtils.rfind(this, predicate); }

    item(id: string) { return this.findBy('id', id); }

    items(ids: string[] = []) { return this.rfilter(item => ids.includes(item.id)); }

    selected() { return this.where('selected', true);}

    unselected() { return this.whereNot('selected', true);}

    expanded() { return this.where('expand', true);}

    collapsed() { return this.whereNot('expand', true);}

    ids(): string[] {return this.map(i => i.id);}

    collapse(items?: IMenuItemItems<T>) {
        this.transaction(() => this.getItems(items).forEach(item => item.expand = false));
        return this;
    }

    collapseAll() {
        this.expanded().collapse();
        return this;
    }

    expand(items?: IMenuItemItems<T>) {
        this.transaction(() => this.getItems(items).forEach(item => item.expand = true));
        return this;
    }

    expandAll() {
        this.collapsed().collapse();
        return this;
    }

    select(items?: IMenuItemItems<T>) {
        this.transaction(() => this.getItems(items).forEach(item => item.selected = true));
        return this;
    }

    deselect(items?: IMenuItemItems<T>) {
        this.transaction(() => this.getItems(items).forEach(item => item.selected = false));
        return this;
    }

    deselectAll() {
        this.selected().deselect();
        return this;
    }

    handleClick(item: string | T, e: React.MouseEvent = null) {
        if ( typeof item === 'string' ) {
            item = this.item(item);
        }
        let ret = this.manager.handleMenuItemClick(item, e, this);
        this.update();
        return ret;
    }

    getItems(items: IMenuItemItems<T> = this): MenuItems<T> {
        if ( ! Array.isArray(items) ) {
            items = [ items ] as any;
        }
        let res = new MenuItems<T>();
        (items as any[]).forEach(item => {
            if ( typeof item === 'string' ) {
                res.push(this.item(item));
            }
            res.push(item);
        });
        return res;
    }

    getParentsFor(item: string | T): MenuItems<T> {
        if ( typeof item === 'string' ) {
            item = this.item(item);
        }
        let parentId = item[ 'parent' ];
        let parents  = [];
        while ( parentId ) {
            let parent = this.item(parentId);
            parents.push(parent);
            parentId = parent[ 'parent' ];
        }
        return new MenuItems(...parents);
    }

    expandParentsForSelected() {
        this.transaction(() => this.selected().forEach(item => this.getParentsFor(item).forEach(parent => parent.expand = true)));
    }

    canExpandParentsForSelected() {
        return this.selected().filter(item => this.getParentsFor(item).find(parent => parent.expand === false) !== undefined).length > 0;
    }

    findActiveFromRoute() {
        return getActiveFromRoutePath(this) as T | undefined;
    }

    selectActiveFromRoute(expandParents: boolean = false, collapseOthers: boolean = false) {
        this.transaction(() => {
            let active = this.findActiveFromRoute();
            if ( active ) {
                if ( expandParents && collapseOthers ) {
                    this.collapseAll();
                }
                this.select(active);
                if ( expandParents ) {
                    this.expandParentsForSelected();
                }
            }
        });
    }
}
