import React, { Fragment } from 'react';
import { lazyInject } from '../../ioc';
import { Store } from '../../stores';
import { observer } from 'mobx-react';
import { hot } from '../../decorators';
import { Affix, Layout } from 'antd';
import { DynamicMenu } from '../dynamic-menu';
import { observe } from 'mobx';
import { LayoutStoreSide } from 'stores/store.layout';
import { IStoreProxy } from 'stores/proxy';
import { classes } from 'typestyle';
import { CookieStorage } from 'utils/storage';
import { parseBool } from 'utils/general';
import { AffixProps } from 'antd/lib/affix';
import { getColor } from 'utils/colors';
import { Icon } from 'components/Icon';
import { color } from 'csx';

const { Header, Footer, Sider, Content } = Layout;

const log = require('debug')('components:layout:sidebar');

export interface LayoutSideProps {
    side: 'left' | 'right'
    onCollapse?: (collapsed: boolean) => void
}

const ToggableAffix = ({ enabled, children, ...props }: AffixProps & { children?: any, enabled?: boolean }) => enabled ? <Affix {...props} children={children}/> : <Fragment>{children}</Fragment>;

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


    render() {
        let side = this.store.layout[ this.props.side ];

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
                onCollapse={this.onCollapse}
            >
                <ToggableAffix enabled={side.fixed} style={{ height: '100%', backgroundColor: getColor(side.color) }}>
                    {/*{siderToggle}*/}
                    <DynamicMenu
                        className={className('side-menu')}
                        items={side.menu}
                        subMenuCloseDelay={side.collapsed ? 0.2 : 1}
                        mode="inline"
                        inlineCollapsed={side.collapsed}
                        inlineIndent={15}
                        color={side.color}
                    />
                </ToggableAffix>
            </Sider>

        );
    }
}
