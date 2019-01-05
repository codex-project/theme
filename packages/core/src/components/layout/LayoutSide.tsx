import * as React from 'react';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { Layout } from 'antd';
// noinspection ES6UnusedImports
import styles from './layout.mscss';
import './layout.mscss';
import { DynamicMenu } from 'components/dynamic-menu';

const { Header, Footer, Sider, Content } = Layout;

const log = require('debug')('components:layout:sidebar');

export interface LayoutSideProps {
    side: 'left' | 'right'
}

@hot(module)
@observer
export class LayoutSide extends React.Component<LayoutSideProps> {
    static displayName                            = 'LayoutSidebar';
    static defaultProps: Partial<LayoutSideProps> = {};
    @lazyInject('store') store: Store;

    state = { collapsedBeforeResponsive: null };

    public componentDidMount(): void {
        let side = this.store.layout[ this.props.side ];
        this.setState({ collapsedBeforeResponsive: side.collapsed });
    }

    render() {
        // let { left, right, header, footer, content, middle } = this.store.layout;
        // let { children }                                     = this.props
        let side = this.store.layout[ this.props.side ];

        return (
            <Sider
                collapsible
                styleName="sidebar"
                breakpoint="xs"
                style={side.computedStyle}
                className={side.computedClass}
                width={side.width}
                defaultCollapsed={true}
                collapsed={side.collapsed}
                collapsedWidth={side.collapsedWidth}
                trigger={null}
                onCollapse={(collapsed, type) => {
                    log('onCollapse', this.props.side, { type, collapsed, collapsedBeforeResponsive: this.state.collapsedBeforeResponsive });
                    if ( type === 'responsive' ) {
                        if ( collapsed !== this.state.collapsedBeforeResponsive ) {
                            return;
                        }
                    }
                    side.setCollapsed(collapsed);
                }}
            >
                <DynamicMenu
                    styleName="sidebar-menu"
                    items={side.menu}
                    subMenuCloseDelay={side.collapsed ? 0.2 : 1}
                    mode="inline"
                />
            </Sider>

        );
    }
}
