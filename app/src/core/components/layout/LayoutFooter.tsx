import React from 'react';

import { hot } from 'react-hot-loader';
import { IStoreProxy, LayoutStorePart, Store } from 'stores';
import { lazyInject } from 'ioc';

import { observer } from 'mobx-react';

import { Layout } from 'antd';
import { classes } from 'typestyle';
import { DynamicContent, isDynamicChildren } from 'components/dynamic-content';

const { Footer } = Layout;

const log = require('debug')('components:layout:footer');

export interface LayoutFooterProps {}

@hot(module)
@observer
export class LayoutFooter extends React.Component<LayoutFooterProps> {
    static displayName                              = 'LayoutFooter';
    static defaultProps: Partial<LayoutFooterProps> = {};
    @lazyInject('store') store: Store;

    getChildren(part: LayoutStorePart<any> | IStoreProxy<LayoutStorePart<any>>) {
        if ( ! this.props.children && isDynamicChildren(part.children) ) {
            return <DynamicContent children={part.children}/>;
        }
        if ( this.props.children && isDynamicChildren(this.props.children) ) {
            return <DynamicContent children={this.props.children}/>;
        }
        if ( ! this.props.children ) {
            return (
                null
            );
        }
        return this.props.children;
    }

    render() {
        const { children }                     = this.props;
        const { footer }                       = this.store.layout;
        const { computedStyle, computedClass } = footer;
        let className                          = (name: string, ...names) => classes(`c-layout-${name}`, ...names);

        return (
            <Footer style={computedStyle} className={className('footer', computedClass)}>
                {this.getChildren(footer)}

            </Footer>
        );
    }
}

export default LayoutFooter;
