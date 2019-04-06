import React from 'react';
import PropTypes from 'prop-types';
import { Menu as AntdMenu } from 'antd';
import { observer } from 'mobx-react';
import { MenuProps as AntdMenuProps } from 'antd/es/menu';
import { ClickParam } from 'antd/lib/menu';
import { transaction } from 'mobx';
import { getColor } from 'utils/colors';
import { MenuItems, MenuManager } from 'menus';

import { hot } from 'decorators';
import { MenuItem } from '@codex/api';
import { app, lazyInject } from 'ioc';

import './index.scss';
import { getClassNamer } from 'utils/getClassNamer';

const log = require('debug')('components:DynamicMenu');

export type MenuExpandBehaviourType = 'single-root' | 'multi-root'
export type MenuSelectBehaviourType = 'single' | 'multi'

export interface DynamicMenuBaseProps {
    items: any[]
    color?: string,
    renderer?: string
    multiroot?: boolean
    selectFromRoutePath?: boolean
}

interface State {
    items: MenuItems
}


export type DynamicMenuProps = DynamicMenuBaseProps & AntdMenuProps

@hot(module)
@observer
export class DynamicMenu extends React.Component<DynamicMenuProps, State> {
    static displayName                                                        = 'DynamicMenu';
    static defaultProps: Partial<DynamicMenuBaseProps & AntdMenuProps>        = {
        prefixCls          : 'c-menu',
        mode               : 'horizontal',
        multiroot          : false,
        multiple           : false,
        selectFromRoutePath: true,
        items              : [],
    };
    static renderers: Record<string, React.ComponentType<{ item: MenuItem }>> = {};
    static contextTypes                                                       = {
        siderCollapsed: PropTypes.bool,
        collapsedWidth: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    };
    context: { siderCollapsed: boolean, collapsedWidth: number | string };
    state                                                                     = { items: new MenuItems };
    @lazyInject('menumanager') manager: MenuManager;

    componentDidMount() {
        DynamicMenu.selectFromRoutePath(this.state.items, this.props.multiroot);
    }

    static getDerivedStateFromProps(nextProps: Readonly<DynamicMenuProps>, state: State) {
        let items = nextProps.items;
        if ( items instanceof MenuItems === false ) {
            items = MenuItems.from(app.menus.apply(nextProps.items));
        }
        state.items = items as any;
        return state;
    }

    static selectFromRoutePath(items, multiRoot = false) {
        items.deselectAll();
        items.selectActiveFromRoute(true, ! multiRoot);
    }

    openKeys     = [];
    onOpenChange = (openKeys: string[]) => transaction(() => {
        log('onOpenChange', openKeys);

        if ( ! this.props.multiroot && openKeys.length > this.openKeys.length ) {
            let openedId = openKeys[ openKeys.length - 1 ];
            let rootIds  = this.state.items.ids();
            if ( rootIds.includes(openedId) ) {
                let toCloseIds = openKeys.filter(key => key !== openedId).filter(key => rootIds.includes(key));
                this.state.items.collapseAll();
                this.state.items.items([ openedId ]).expand();
            }
        } else {
            this.state.items.collapseAll().items(openKeys).expand();
        }
    });

    onClick = (param: ClickParam) => {
        log('onClick', param);
        // let { items } = this.props;
        let item = this.state.items.item(param.key);

        this.state.items.handleClick(item, param.domEvent);
        if ( item.selected ) {
            if ( this.props.multiple === false ) {
                this.state.items.deselectAll().select(item);
            }
        } else {
            // this.selectFromRoutePath();
        }

    };

    onTitleClick = (param: ClickParam) => transaction(() => {
        log('onTitleClick', param);
        let item = this.state.items.item(param.key);
        this.state.items.handleClick(item, param.domEvent);
    });

    renderMenuItem(item: MenuItem, level?: number) {
        const { color, mode, items } = this.props;
        const cls                    = getClassNamer(this);
        const className              = cls([ 'item', `item-${item.type}`, `renderer-${item.renderer}` ], [ item.class ]);

        let inner    = this.manager.renderInner(item, this);
        let rendered = this.manager.render(inner, item, this);
        if ( rendered ) {
            rendered = this.manager.rendered(rendered, item, this);
        }
        return React.cloneElement(rendered, { ...rendered.props, className });
    }

    render() {
        const { children, className, multiple, multiroot, selectFromRoutePath, prefixCls, mode, color, renderer, ...props } = this.props;
        if ( typeof this.state.items.selected !== 'function' ) {
            return null;
        }
        const cls = getClassNamer(this);
        return (
            <AntdMenu
                mode={mode}
                className={cls.root(mode, 'theme-' + mode)()}
                subMenuCloseDelay={0.6}
                style={{ backgroundColor: getColor(color) }}
                selectedKeys={this.state.items.selected().ids()}
                openKeys={this.state.items.expanded().ids()}
                onClick={this.onClick}
                onOpenChange={this.onOpenChange}
                multiple={multiple}
                {...props}
            >
                {this.state.items.map(item => this.renderMenuItem(item, 0))}
            </AntdMenu>
        );
    }
}

