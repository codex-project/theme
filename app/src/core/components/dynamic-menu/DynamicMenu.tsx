import React from 'react';
import PropTypes from 'prop-types';
import { Menu as AntdMenu } from 'antd';
import { observer } from 'mobx-react';
import { MenuProps as AntdMenuProps } from 'antd/es/menu';
import { classes } from 'typestyle';
import { ClickParam } from 'antd/lib/menu';
import { transaction } from 'mobx';
import { getColor } from 'utils/colors';
import { MenuItems, MenuManager } from 'menus';

import { hot } from 'decorators';
import { MenuItem } from '@codex/api';
import { lazyInject } from 'ioc';

import './index.scss'
const log = require('debug')('components:DynamicMenu');

export type MenuExpandBehaviourType = 'single-root' | 'multi-root'
export type MenuSelectBehaviourType = 'single' | 'multi'

export interface DynamicMenuBaseProps {
    items: MenuItems
    color?: string,
    renderer?: string
    multiroot?: boolean
    selectFromRoutePath?: boolean
}

interface State {
    openKeys: string[]
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
    @lazyInject('menumanager') manager: MenuManager;

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

        let inner    = this.manager.renderInner(item, this);
        let rendered = this.manager.render(inner, item, this);
        if ( rendered ) {
            rendered = React.cloneElement(rendered, { className });
            rendered = this.manager.rendered(rendered, item, this);
        }
        return rendered;
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

export default DynamicMenu;
