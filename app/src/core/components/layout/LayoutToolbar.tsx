import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { IStoreProxy, LayoutStorePart, Store } from 'stores';
import { Toolbar, ToolbarColumn, ToolbarProps, ToolbarSpacer } from 'components/toolbar';
import { DynamicContent, isDynamicChildren } from 'components/dynamic-content';
import { TunnelPlaceholder } from 'components/tunnel';
import { Affix } from 'components/affix';
import posed from 'react-pose';

const log = require('debug')('components:layout-toolbar');

export interface LayoutToolbarProps extends ToolbarProps {
    children?: any[]
    containerRef?: React.RefObject<HTMLDivElement>
}

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

@observer
export class LayoutToolbar extends Component<LayoutToolbarProps> {
    @lazyInject('store') store: Store;
    static displayName                               = 'LayoutToolbar';
    static defaultProps: Partial<LayoutToolbarProps> = {
        containerRef: React.createRef(),
    };

    getChildren(part: LayoutStorePart<any> | IStoreProxy<LayoutStorePart<any>>) {
        if ( ! this.props.children && isDynamicChildren(this.store.layout.toolbar.children) ) {
            return <DynamicContent children={this.store.layout.toolbar.children}/>;
        }
        if ( this.props.children && isDynamicChildren(this.props.children) ) {
            return <DynamicContent children={this.props.children}/>;
        }
        if ( ! this.props.children ) {
            return (
                <Fragment>
                    <ToolbarColumn>
                        <TunnelPlaceholder id='layout-toolbar-left' delay={1500} multiple/>
                        <DynamicContent children={this.store.layout.toolbar.left}/>
                    </ToolbarColumn>
                    <ToolbarSpacer/>
                    <ToolbarColumn>
                        <TunnelPlaceholder id='layout-toolbar-right' delay={1500} multiple/>
                        <DynamicContent children={this.store.layout.toolbar.right}/>
                    </ToolbarColumn>
                </Fragment>
            );
        }
        return this.props.children;
    }


    render() {
        const { children, ...props } = this.props;
        return (
            <Affix enabled={this.store.layout.toolbar.fixed}>
                <ToolbarContainer ref={this.props.containerRef}>
                    <Toolbar {...props}>
                        {this.getChildren(this.store.layout.toolbar)}
                    </Toolbar>
                </ToolbarContainer>
            </Affix>
        );
    }
}


// let content: any = this.props.children;
// if ( ! this.props.children && isDynamicChildren(this.store.layout.toolbar.children) ) {
//     content = <DynamicContent children={this.store.layout.toolbar.children}/>;
// }
// if ( this.props.children && isDynamicChildren(this.props.children) ) {
//     content = <DynamicContent children={this.props.children}/>;
// }
// if ( ! this.props.children ) {
//     content = [
//         <ToolbarColumn key="left">
//             <TunnelPlaceholder id='layout-toolbar-left' delay={300} multiple/>
//             <DynamicContent children={this.store.layout.toolbar.left}/>
//         </ToolbarColumn>,
//         <ToolbarSpacer key="spacer"/>,
//         <ToolbarColumn key="right">
//             <TunnelPlaceholder id='layout-toolbar-right' delay={300} multiple/>
//             <DynamicContent children={this.store.layout.toolbar.right}/>
//         </ToolbarColumn>,
//     ];
// }
