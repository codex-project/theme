import React from 'react';
import { LayoutStore } from '../../stores/store.layout';
import { hot } from '../../decorators';
import { observer } from 'mobx-react';
import { Layout as AntdLayout } from 'antd';
import { StoreControl } from '../../components/StoreControl';
import { lazyInject } from '../../ioc';
import { LayoutHeader } from '../../components/layout/LayoutHeader';
// noinspection ES6UnusedImports
// import styles from './layout.mscss';
import './layout.mscss';
import './index.scss';
import { LayoutSide } from '../../components/layout/LayoutSide';
import { LayoutFooter } from '../../components/layout/LayoutFooter';


const { Sider, Header, Content, Footer } = AntdLayout;

interface LayoutState {}

export interface LayProps {
    left?: React.ReactNode
    right?: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    content?: React.ReactNode
}

@hot(module)
@observer
export class Layout extends React.Component<LayProps, LayoutState> {
    static displayName                     = 'Layout';
    static defaultProps: Partial<LayProps> = {
        left   : null,
        right  : null,
        header : null,
        footer : null,
        content: null,
    };
    static Header: typeof LayoutHeader     = LayoutHeader;
    static Footer: typeof LayoutFooter     = LayoutFooter;
    static Side: typeof LayoutSide         = LayoutSide;

    @lazyInject('store.layout') layout: LayoutStore;

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

                        <Content style={content.computedStyle} className={content.computedClass}>
                            {children || props.content || null}
                        </Content>

                        <If condition={right.show && ! right.outside}>
                            <LayoutSide side='right'/>
                        </If>
                    </AntdLayout>

                    <If condition={footer.show}>
                        <LayoutFooter>{props.footer}</LayoutFooter>
                    </If>
                </AntdLayout>
                <If condition={right.show && right.outside}>
                    <LayoutSide side='right'/>
                </If>


                {this.renderStoreController()}
            </AntdLayout>
        );
    }

    renderStoreController() {
        return (
            <StoreControl store={this.layout} stores={{
                'container': {
                    stretch: 'boolean',
                },
                'header'   : {
                    show  : 'boolean',
                    height: 'number',
                    fixed : 'boolean',
                    color : 'color.name',
                    logo  : 'boolean',
                    menu  : 'menu',
                },
                'left'     : {
                    show          : 'boolean',
                    width         : 'number',
                    collapsedWidth: 'number',
                    collapsed     : 'boolean',
                    outside       : 'boolean',
                    color         : 'color.name',
                    menu          : 'menu',
                },
                'right'    : {
                    show          : 'boolean',
                    width         : 'number',
                    collapsedWidth: 'number',
                    collapsed     : 'boolean',
                    outside       : 'boolean',
                    color         : 'color.name',
                },
                'middle'   : {
                    padding: 'string',
                    margin : 'string',
                    color  : 'color.name',
                },
                'content'  : {
                    padding: 'string',
                    margin : 'string',
                    color  : 'color.name',
                },
                'footer'   : {
                    show  : 'boolean',
                    height: 'number',
                    fixed : 'boolean',
                    color : 'color.name',
                },
            }}/>
        );
    }
}
