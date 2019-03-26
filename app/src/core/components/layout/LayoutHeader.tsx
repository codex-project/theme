import React, { Fragment } from 'react';

import { hot } from 'react-hot-loader';
import { IStoreProxy, LayoutStorePart, Store } from 'stores';
import { lazyInject } from 'ioc';
import { observer } from 'mobx-react';
import { Layout, Menu as AntdMenu, Tooltip } from 'antd';
import { DynamicMenu } from '../dynamic-menu';
import { classes } from 'typestyle';
import { MenuItemIcon } from '../dynamic-menu/MenuItemIcon';
import { FontAwesomeIcon } from 'interfaces';
import { getColor } from 'utils/colors';
import { RouteLink } from 'router';
import { DynamicContent, isDynamicChildren } from 'components/dynamic-content';

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

    getChildren(part: LayoutStorePart<any> | IStoreProxy<LayoutStorePart<any>>) {
        const className = (name: string, ...names) => classes(`c-layout-${name}`, ...names);

        if ( ! this.props.children && isDynamicChildren(part.children) ) {
            return <DynamicContent children={part.children}/>;
        }
        if ( this.props.children && isDynamicChildren(this.props.children) ) {
            return <DynamicContent children={this.props.children}/>;
        }
        if ( ! this.props.children ) {
            return (
                <Fragment>
                    <DynamicMenu
                        theme="dark"
                        mode="horizontal"
                        className={className('header-menu')}
                        color={part.color}
                        items={part.menu}
                        overflowedIndicator={<span className={className('header-menu-overflowed-title')}><MenuItemIcon item={{ icon: 'bars' }}/></span>}
                    />
                </Fragment>
            );
        }
        return this.props.children;
    }

    className = (name: string, ...names) => classes(`c-layout-${name}`, ...names);

    render() {
        let { children }                                     = this.props;
        let { left, middle, header, right }                  = this.store.layout;
        let { computedStyle, computedClass, menu }           = header;
        const devLinks                                       = [
            '/',
            '/about',
            '/grid',
            '/documentation',
            '/documentation/codex',
            '/documentation/codex/master',
            '/documentation/codex/master/index',
            '/documentation/codex/master/getting-started/installation',
            '/phpdoc/codex/master',
            '/phpdoc-test',
            '/phpdoc-mosaic',
        ];
        let toggleTooltip                                    = {
            left : `Click to ${left.collapsed ? 'open' : 'close'} the left menu`,
            right: `Click to ${right.collapsed ? 'open' : 'close'} the right menu`,
        };
        let toggleClassName: Record<string, FontAwesomeIcon> = {
            left : left.collapsed ? 'indent' : 'outdent',
            right: left.collapsed ? 'outdent' : 'indent',
        };
        let className                                        = this.className;
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
                {this.getChildren(header)}
                <If condition={this.store.config.debug}>
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
                                return <AntdMenu.Item {...props}><RouteLink to={link}>{link}</RouteLink></AntdMenu.Item>;
                            })}
                        </AntdMenu.SubMenu>
                    </AntdMenu>
                </If>
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
