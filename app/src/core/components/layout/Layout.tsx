import React, { RefObject } from 'react';
import { LayoutStore } from 'stores/LayoutStore';
import { hot } from 'decorators';
import { observer } from 'mobx-react';
import { BackTop, Layout as AntdLayout } from 'antd';
import { lazyInject } from 'ioc';
import { LayoutSide } from 'components/layout/LayoutSide';
import './index.scss';
import { Store } from 'stores';
import { Routes } from 'collections/Routes';
import { LayoutHeader } from 'components/layout/LayoutHeader';
import { LayoutFooter } from 'components/layout/LayoutFooter';
import { LayoutBreadcrumbs } from 'components/layout/LayoutBreadcrumbs';
import { Toolbar } from 'components/toolbar';
import posed from 'react-pose';
import { Affix } from 'components/affix';
import { TunnelPlaceholder } from 'components/tunnel';


const { Sider, Header, Content, Footer } = AntdLayout;


const ToolbarContainer = posed.div({
    enter: {
        opacity       : 1,
        delay         : 500,
        beforeChildren: true,
    },
    exit : {
        opacity   : 0,
        transition: { duration: 500 },
        delay     : 500,
    },
});

export interface LayoutProps {
    left?: React.ReactNode
    right?: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    content?: React.ReactNode
}

@hot(module)
@observer
export class Layout extends React.Component<LayoutProps> {
    static displayName                           = 'Layout';
    static defaultProps: Partial<LayoutProps>    = { left: null, right: null, header: null, footer: null, content: null };
    static Header: typeof LayoutHeader           = LayoutHeader;
    static Footer: typeof LayoutFooter           = LayoutFooter;
    static Side: typeof LayoutSide               = LayoutSide;
    static Breadcrumbs: typeof LayoutBreadcrumbs = LayoutBreadcrumbs;

    @lazyInject('store.layout') layout: LayoutStore;
    @lazyInject('store') store: Store;

    toolbarContainerRef: RefObject<HTMLDivElement> = React.createRef();

    render() {
        window[ 'layout' ]                                                = this;
        const { children, ...props }                                      = this.props;
        const { container, header, left, middle, content, right, footer } = this.layout;
        let contentLayoutMinHeight                                        = this.toolbarContainerRef.current ? this.toolbarContainerRef.current.getBoundingClientRect().height : 0;

        return (
            <AntdLayout style={container.computedStyle}>
                <TunnelPlaceholder id="layout-top" delay={0} multiple/>

                <If condition={left.show && left.outside}>
                    <LayoutSide side='left'>{props.left}</LayoutSide>
                </If>

                <AntdLayout>
                    <If condition={header.show}>
                        <LayoutHeader>{props.header}</LayoutHeader>
                    </If>

                    <AntdLayout style={middle.computedStyle} className={middle.computedClass}>
                        <If condition={left.show && ! left.outside}>
                            <LayoutSide side='left'>{props.left}</LayoutSide>
                        </If>

                        <Content style={{ minHeight: '100%' }}>
                            <Affix enabled={true}>
                                <ToolbarContainer ref={this.toolbarContainerRef}>
                                    <Toolbar
                                        style={{
                                            backgroundColor: content.computedStyle.backgroundColor,
                                            paddingLeft    : content.computedStyle.marginLeft,
                                            paddingRight   : content.computedStyle.marginRight,
                                        }}
                                    />
                                    <Toolbar.Item side="left">
                                        <LayoutBreadcrumbs/>
                                    </Toolbar.Item>
                                </ToolbarContainer>
                            </Affix>

                            <AntdLayout style={{ minHeight: `calc(100% - ${contentLayoutMinHeight}px)` }}>
                                <Content style={content.computedStyle} className={content.computedClass}>
                                    {children || props.content || null}
                                </Content>
                            </AntdLayout>
                        </Content>

                        <If condition={right.show && ! right.outside}>
                            <LayoutSide side='right'>{props.right}</LayoutSide>
                        </If>
                    </AntdLayout>

                    <If condition={footer.show}>
                        <LayoutFooter>{props.footer}</LayoutFooter>
                    </If>
                </AntdLayout>

                <If condition={right.show && right.outside}>
                    <LayoutSide side='right'>{props.right}</LayoutSide>
                </If>

                <BackTop/>

                <TunnelPlaceholder id="layout-bottom" delay={0} multiple/>
            </AntdLayout>
        );
    }

}
export default Layout
