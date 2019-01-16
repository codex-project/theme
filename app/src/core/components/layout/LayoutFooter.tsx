import * as React from 'react';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { Layout } from 'antd';
import { classes } from 'typestyle';

const { Footer } = Layout;

const log = require('debug')('components:layout:footer');

export interface LayoutFooterProps {}

@hot(module)
@observer
export class LayoutFooter extends React.Component<LayoutFooterProps> {
    static displayName                              = 'LayoutFooter';
    static defaultProps: Partial<LayoutFooterProps> = {};
    @lazyInject('store') store: Store;

    render() {
        const { children }                     = this.props;
        const { footer }                       = this.store.layout;
        const { computedStyle, computedClass } = footer;
        let className                          = (name: string, ...names) => classes(`c-layout-${name}`, ...names);

        return (
            <Footer style={computedStyle} className={className('footer', computedClass)}>
                {children}
            </Footer>
        );
    }
}
