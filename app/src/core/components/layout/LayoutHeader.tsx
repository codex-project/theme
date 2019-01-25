import * as React from 'react';

import { hot } from 'decorators';
import { Store } from 'stores';
import { lazyInject } from 'ioc';
import { observer } from 'mobx-react';
import { Layout, Menu as AntdMenu, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import { DynamicMenu } from '../dynamic-menu';
import { classes } from 'typestyle';
import { MenuItemIcon } from '../dynamic-menu/MenuItemIcon';
import { FontAwesomeIcon } from 'interfaces';
import { getColor } from 'utils/colors';

const { Header } = Layout;

const log = require('debug')('components:layout:header');

export interface LayoutHeaderProps {
}

@hot(module)
@observer
export class LayoutHeader extends React.Component<LayoutHeaderProps> {
    @lazyInject('store') store: Store;
    static displayName                              = 'LayoutHeader';
    static defaultProps: Partial<LayoutHeaderProps> = {};

    render() {
        let { children }                                     = this.props;
        let { left, middle, header, right }                  = this.store.layout;
        let { computedStyle, computedClass, menu }           = header;
        const devLinks                                       = [
            '/',
            '/about',
            '/documentation',
            '/documentation/codex',
            '/documentation/codex/master',
            '/documentation/codex/master/index',
            '/documentation/codex/master/getting-started/installation',
        ];
        let toggleTooltip                                    = {
            left : `Click to ${left.collapsed ? 'open' : 'close'} the left menu`,
            right: `Click to ${right.collapsed ? 'open' : 'close'} the right menu`,
        };
        let toggleClassName: Record<string, FontAwesomeIcon> = {
            left : left.collapsed ? 'indent' : 'outdent',
            right: left.collapsed ? 'outdent' : 'indent',
        };
        let className                                        = (name: string, ...names) => classes(`c-layout-${name}`, ...names);
        return (
            <Header style={computedStyle} className={className('header', computedClass)}>
                <If condition={header.show_left_toggle}>
                    <Tooltip placement="right" title={toggleTooltip.left}>
                        <i className={className('header-toggle', 'fa', 'fa-' + toggleClassName.left)} onClick={() => left.setCollapsed(! left.collapsed)}/>
                    </Tooltip>
                </If>
                <If condition={header.logo}>
                    <div className={className('header-title')} style={{ width: left.width }}>
                        {this.store.codex.display_name}
                    </div>
                </If>
                <div style={{ flexGrow: 10 }}/>
                <DynamicMenu
                    theme="dark"
                    mode="horizontal"
                    className={className('header-menu')}
                    color={header.color}
                    items={menu}
                    overflowedIndicator={<span className={className('header-menu-overflowed-title')}><MenuItemIcon item={{ icon: 'bars' }}/></span>}
                />
                <AntdMenu
                    theme="dark"
                    mode="horizontal"
                    className={className('header-menu')}
                    style={{ backgroundColor: getColor(header.color) }}
                    selectedKeys={[]}
                >
                    <AntdMenu.SubMenu title="DevLinks" style={{ backgroundColor: getColor(header.color) }}>
                        {devLinks.map(link => {
                            let props = { key: link, style: { backgroundColor: getColor(header.color), margin: 0 } };
                            return <AntdMenu.Item {...props}><NavLink to={link}>{link}</NavLink></AntdMenu.Item>;
                        })}
                    </AntdMenu.SubMenu>
                </AntdMenu>
                <If condition={header.show_right_toggle}>
                    <Tooltip placement="left" title={toggleTooltip.right}>
                        <i className={className('header-toggle', 'fa', 'fa-' + toggleClassName.right)} onClick={() => right.setCollapsed(! right.collapsed)}/>
                    </Tooltip>
                </If>
            </Header>
        );
    }
}

export default LayoutHeader;
