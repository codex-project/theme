import React, { Fragment } from 'react';

import { hot } from 'react-hot-loader';
import { IStoreProxy, LayoutStorePart, Store } from 'stores';
import { lazyInject } from 'ioc';

import { observer } from 'mobx-react';

import { Layout } from 'antd';
import { DynamicContent, isDynamicChildren } from 'components/dynamic-content';
import { Col, Row } from 'components/grid';
import { classNamer } from 'utils/getClassNamer';
import { DynamicMenu } from 'components/dynamic-menu';

// const { Footer } = Layout;
const Footer = Row.wrap(Layout.Footer);
const log    = require('debug')('components:layout:footer');

export interface LayoutFooterProps {
    prefixCls?: string
    className?: string
    style?: React.CSSProperties
}

@hot(module)
@observer
export class LayoutFooter extends React.Component<LayoutFooterProps> {
    static displayName                              = 'LayoutFooter';
    static defaultProps: Partial<LayoutFooterProps> = {
        prefixCls: 'c-layout-footer',
    };
    @lazyInject('store') store: Store;


    className = classNamer(`c-layout-footer`);

    getChildren(part: LayoutStorePart<any> | IStoreProxy<LayoutStorePart<any>>) {
        if ( ! this.props.children && isDynamicChildren(part.children) ) {
            return <DynamicContent children={part.children}/>;
        }
        if ( this.props.children && isDynamicChildren(this.props.children) ) {
            return <DynamicContent children={this.props.children}/>;
        }
        if ( ! this.props.children ) {
            return (
                <Fragment>
                    <Col span={12} className={this.className('col')}>
                        <p className={this.className('copyright')}>{part.text ? part.text.toString() : ''}</p>
                    </Col>
                    <Col span={12} className={this.className('col')}>
                        <DynamicMenu
                            theme="dark"
                            mode="horizontal"
                            className={this.className('menu')}
                            color={part.color}
                            items={part.menu}
                            // overflowedIndicator={<span className={this.className('menu-overflowed-title')}><MenuItemIcon item={{ icon: 'bars' }}/></span>}
                        />
                    </Col>
                </Fragment>
            );
        }
        return this.props.children;
    }

    render() {
        const { children }                     = this.props;
        const { footer }                       = this.store.layout;
        const { computedStyle, computedClass } = footer;
        return (
            <Footer style={computedStyle} className={this.className([ computedClass ])}>
                {this.getChildren(footer)}

            </Footer>
        );
    }
}

