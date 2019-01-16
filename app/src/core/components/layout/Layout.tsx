import React, { Fragment } from 'react';
import { LayoutStore } from '../../stores/store.layout';
import { hot } from '../../decorators';
import { observer } from 'mobx-react';
import { Affix, BackTop, Layout as AntdLayout } from 'antd';
import { lazyInject } from '../../ioc';
import { LayoutSide } from '../../components/layout/LayoutSide';
import './index.scss';
import { Store } from 'stores';
import { Routes } from 'collections/Routes';
import { LayoutHeader } from 'components/layout/LayoutHeader';
import { LayoutFooter } from 'components/layout/LayoutFooter';
import { LayoutBreadcrumbs } from 'components/layout/LayoutBreadcrumbs';
import { Toolbar } from 'components/toolbar/Toolbar';
import posed from 'react-pose';
import { AffixProps } from 'antd/lib/affix';


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

export interface LayProps {
    left?: React.ReactNode
    right?: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    content?: React.ReactNode
}

const ToggableAffix = ({ enabled, children, ...props }: AffixProps & { children?: any, enabled?: boolean }) => enabled ? <Affix {...props} children={children}/> : <Fragment>{children}</Fragment>;

@hot(module)
@observer
export class Layout extends React.Component<LayProps> {
    static displayName                           = 'Layout';
    static defaultProps: Partial<LayProps>       = { left: null, right: null, header: null, footer: null, content: null };
    static Header: typeof LayoutHeader           = LayoutHeader;
    static Footer: typeof LayoutFooter           = LayoutFooter;
    static Side: typeof LayoutSide               = LayoutSide;
    static Breadcrumbs: typeof LayoutBreadcrumbs = LayoutBreadcrumbs;

    @lazyInject('store.layout') layout: LayoutStore;
    @lazyInject('store') store: Store;
    @lazyInject('routes') routes: Routes;

    render() {
        window[ 'layout' ]                                                = this;
        const { children, ...props }                                      = this.props;
        const { container, header, left, middle, content, right, footer } = this.layout;
        return (
            <AntdLayout style={container.computedStyle}>
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
                            <ToggableAffix enabled={true}>
                                <ToolbarContainer>
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
                            </ToggableAffix>
                            <AntdLayout>
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

                <BackTop>

                </BackTop>
            </AntdLayout>
        );
    }

}
