import React from 'react';

import { hot } from 'decorators';
import { IStoreProxy, LayoutStoreSide, Store } from 'stores';
import { lazyInject } from 'ioc';
import { observer } from 'mobx-react';
import { Layout } from 'antd';
import { DynamicMenu } from '../dynamic-menu';
import { observe } from 'mobx';
import { classes } from 'typestyle';
import { Icon } from '../icon';
import { Affix } from '../affix';
import { CookieStorage } from 'utils/storage';
import { parseBool } from 'utils/general';
import { getColor } from 'utils/colors';

const { Header, Footer, Sider, Content } = Layout;

const log = require('debug')('components:layout:sidebar');

export interface LayoutSideProps {
    side: 'left' | 'right'
    onCollapse?: (collapsed: boolean) => void
}


@hot(module)
@observer
export class LayoutSide extends React.Component<LayoutSideProps> {
    static displayName                            = 'LayoutSidebar';
    static defaultProps: Partial<LayoutSideProps> = {
        onCollapse: collapsed => null,
    };
    @lazyInject('store') store: Store;

    state = { collapsedBeforeResponsive: null };

    get side(): IStoreProxy<LayoutStoreSide> {return this.store.layout[ this.props.side ];}


    public componentDidMount(): void {
        if ( CookieStorage.has(`layout.${this.props.side}.collapsed`) ) {
            this.side.setCollapsed(parseBool(CookieStorage.get(`layout.${this.props.side}.collapsed`)));
        }
        observe(this.side, 'collapsed', (change) => {
            log('observe collapsed');
            CookieStorage.set(`layout.${this.props.side}.collapsed`, change.newValue);
            if ( change.newValue === true ) {
                this.side.menu.collapseAll();
            }
        });
        this.setState({ collapsedBeforeResponsive: this.side.collapsed });
    }

    render() {
        let { children } = this.props;
        let side         = this.store.layout[ this.props.side ];

        let className = (name: string, ...names) => classes(`c-layout-${name}`, ...names);

        const siderToggle = <Icon
            name={side.collapsed ? 'chevron-right' : 'chevron-left'}
            className={className('side-toggle')}
            style={{ width: side.collapsed ? side.collapsedWidth : side.width }}
            onClick={() => side.setCollapsed(! side.collapsed)}
        />;

        return (
            <Sider
                collapsible
                breakpoint="xs"
                style={side.computedStyle}
                className={className('side', `c-layout-side-${this.props.side}`, side.computedClass)}
                width={side.width}
                defaultCollapsed={true}
                collapsed={side.collapsed}
                collapsedWidth={side.collapsedWidth}
                trigger={null}
            >
                {
                    children ?
                    children :
                    <Affix enabled={side.fixed} style={{ height: '100%', backgroundColor: getColor(side.color) }}>
                        {/*{siderToggle}*/}
                        <DynamicMenu
                            className={className('side-menu')}
                            items={side.menu}
                            subMenuCloseDelay={side.collapsed ? 0.2 : 1}
                            mode="inline"
                            inlineCollapsed={side.collapsed}
                            inlineIndent={15}
                            selectFromRoutePath={true}
                            color={side.color}
                        />
                    </Affix>
                }
            </Sider>

        );
    }
}

export default LayoutSide;
