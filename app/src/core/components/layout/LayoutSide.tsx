import React from 'react';
import { lazyInject } from '../../ioc';
import { Store } from '../../stores';
import { observer } from 'mobx-react';
import { hot } from '../../decorators';
import { Layout } from 'antd';
import { DynamicMenu } from '../dynamic-menu';
import { observe } from 'mobx';
import { LayoutStoreSide } from 'stores/store.layout';
import { IStoreProxy } from 'stores/proxy';
import { classes } from 'typestyle';

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
        observe(this.side, 'collapsed', (change) => {
            if ( change.newValue === true ) {
                this.side.menu.collapseAll();
            }
        });
        this.setState({ collapsedBeforeResponsive: this.side.collapsed });
    }

    onCollapse = (collapsed, type?) => {
        log('onCollapse', this.props.side, { type, collapsed, collapsedBeforeResponsive: this.state.collapsedBeforeResponsive });
        if ( this.side.collapsed === collapsed ) {
            return;
        }
        if ( type === 'responsive' ) {
            if ( collapsed !== this.state.collapsedBeforeResponsive ) {
                return;
            }
        }
        this.side.setCollapsed(collapsed);
        this.props.onCollapse(collapsed);
    };

    siderRef = React.createRef() as any
    menuRef:DynamicMenu = React.createRef() as any
    render() {
        let side = this.store.layout[ this.props.side ];

        let className = (name: string, ...names) => classes(`c-layout-${name}`, ...names);
        return (
            <Sider
                ref={this.siderRef as any}
                collapsible
                breakpoint="xs"
                style={side.computedStyle}
                className={className('side', `c-layout-side-${this.props.side}`, side.computedClass)}
                width={side.width}
                defaultCollapsed={true}
                collapsed={side.collapsed}
                collapsedWidth={side.collapsedWidth}
                trigger={null}
                onCollapse={this.onCollapse}
            >
                <DynamicMenu
                    ref={this.menuRef  as any}
                    className={className('side-menu')}
                    items={side.menu}
                    subMenuCloseDelay={side.collapsed ? 0.2 : 1}
                    mode="inline"
                    inlineCollapsed={side.collapsed}
                    inlineIndent={15}
                    color={side.color}
                />
            </Sider>

        );
    }
}
