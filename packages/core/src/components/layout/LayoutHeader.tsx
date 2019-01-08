import * as React from 'react';
import { lazyInject } from '../../ioc';
import { Store } from '../../stores';
import { observer } from 'mobx-react';
import { hot } from '../../decorators';
import { Layout, Menu as AntdMenu, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
// noinspection ES6UnusedImports
import styles from './layout.mscss';
import './layout.mscss';
import { getColor } from '../../utils/colors';
import { DynamicMenu } from '../dynamic-menu';

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
        let { children }                           = this.props;
        let { left, middle, header, right }        = this.store.layout;
        let { computedStyle, computedClass, menu } = header;
        const devLinks                             = [
            '/',
            '/about',
            '/documentation',
            '/documentation/codex',
            '/documentation/codex/master',
            '/documentation/codex/master/index',
            '/documentation/codex/master/getting-started/installation',
        ];
        let toggleTooltip                          = {
            left : `Click to ${left.collapsed ? 'open' : 'close'} the left menu`,
            right: `Click to ${right.collapsed ? 'open' : 'close'} the right menu`,
        };
        let toggleClassName                        = {
            left : left.collapsed ? 'indent' : 'outdent',
            right: left.collapsed ? 'outdent' : 'indent',
        };
        return (
            <Header styleName="header" style={computedStyle} className={computedClass}>
                <If condition={header.logo}>
                    <div styleName="header-logo" style={{ width: left.width }}/>
                </If>
                <If condition={header.show_left_toggle}>
                    <Tooltip placement="right" title={toggleTooltip.left}>
                        <i className={'fa fa-' + toggleClassName.left}
                           styleName="header-toggle"
                           onClick={() => left.setCollapsed(! left.collapsed)}
                        />
                    </Tooltip>
                </If>
                <DynamicMenu
                    theme="dark"
                    mode="horizontal"
                    styleName="header-menu"
                    color={header.color}
                    items={menu}
                    renderer="header"
                />
                <div style={{ flexGrow: 10 }}/>
                <AntdMenu
                    theme="dark"
                    mode="horizontal"
                    styleName="header-menu"
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
                        <i className={'fa fa-' + toggleClassName.right}
                           styleName="header-toggle"
                           onClick={() => right.setCollapsed(! right.collapsed)}
                        />
                    </Tooltip>
                </If>
            </Header>
        );
    }
}
