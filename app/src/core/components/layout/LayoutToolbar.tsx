import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { IStoreProxy, LayoutStorePart, Store } from 'stores';
import { Toolbar, ToolbarColumn, ToolbarProps, ToolbarSpacer } from 'components/toolbar';
import { DynamicContent, isDynamicChildren } from 'components/dynamic-content';
import { TunnelPlaceholder } from 'components/tunnel';

export interface LayoutToolbarProps extends ToolbarProps {
    children?: any[]
}

@hot(module)
@observer
export class LayoutToolbar extends Component<LayoutToolbarProps> {
    @lazyInject('store') store: Store;
    static displayName                               = 'LayoutToolbar';
    static defaultProps: Partial<LayoutToolbarProps> = {

    };

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
                    <ToolbarColumn>
                        <TunnelPlaceholder id='layout-toolbar-left' delay={1500} multiple/>
                        <DynamicContent children={part.left}/>
                    </ToolbarColumn>
                    <ToolbarSpacer/>
                    <ToolbarColumn>
                        <TunnelPlaceholder id='layout-toolbar-right' delay={1500} multiple/>
                        <DynamicContent children={part.right}/>
                    </ToolbarColumn>
                </Fragment>
            );
        }
        return this.props.children;
    }

    render() {
        const { children, ...props } = this.props;
        const { toolbar }            = this.store.layout;

        return (
            <Toolbar {...props}>
                {this.getChildren(toolbar)}
            </Toolbar>
        );
    }
}
