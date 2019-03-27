import React, { RefObject } from 'react';
import { observer } from 'mobx-react';
import { BackTop, Layout as AntdLayout } from 'antd';
import { LayoutSide } from './LayoutSide';
import { LayoutHeader } from './LayoutHeader';
import { LayoutFooter } from './LayoutFooter';
import { TunnelPlaceholder } from '../tunnel';

import './index.scss';
import { LayoutStore, Store } from 'stores';
import { lazyInject } from 'ioc';
import { hot } from 'react-hot-loader';
import { action, observable } from 'mobx';
import { LayoutToolbar } from 'components/layout';

const { Sider, Header, Content, Footer } = AntdLayout;


export interface LayoutProps {
    left?: React.ReactNode
    right?: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    content?: React.ReactNode
    toolbar?: React.ReactNode
}



@hot(module)
@observer
export class Layout extends React.Component<LayoutProps> {
    static displayName                        = 'Layout';
    static defaultProps: Partial<LayoutProps> = { left: null, right: null, header: null, footer: null, content: null };
    @lazyInject('store.layout') layout: LayoutStore;
    @lazyInject('store') store: Store;

    toolbarContainerRef: RefObject<HTMLDivElement> = React.createRef();

    @observable contentLayoutMinHeight = null;
    @action updateContentMinHeight     = () => this.contentLayoutMinHeight = this.toolbarContainerRef.current ? this.toolbarContainerRef.current.getBoundingClientRect().height : 0;
    observer: ResizeObserver;
    observingElement;
    observing;

    observe() {
        if ( this.observing ) {
            this.observing();
        }
        this.observingElement = this.toolbarContainerRef.current;
        if ( this.toolbarContainerRef.current ) {
            this.observer.observe(this.toolbarContainerRef.current);
            this.observing = () => {
                this.observer.unobserve(this.observingElement);
            };
        }
    }

    public componentDidMount(): void {
        this.observer = new ResizeObserver(() => {
            this.updateContentMinHeight();
        });
        this.observe();
    }

    public componentWillUnmount(): void {
        if ( this.observer && this.observer.disconnect ) {
            this.observer.disconnect();
        }
    }

    public componentDidUpdate(prevProps: Readonly<LayoutProps>, prevState: Readonly<{}>, snapshot?: any): void {
        this.observe();
    }

    render() {
        window[ 'layout' ]                                                         = this;
        const { children, ...props }                                               = this.props;
        const { container, header, left, middle, content, right, footer, toolbar } = this.layout;

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
                            <If condition={toolbar.show}>
                                <LayoutToolbar
                                    containerRef={this.toolbarContainerRef}
                                    style={toolbar.computedStyle}
                                    className={toolbar.computedClass}
                                />
                            </If>

                            <AntdLayout style={{ minHeight: `calc(100% - ${this.contentLayoutMinHeight}px)` }}>
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

// export default hot(module)(Layout)
