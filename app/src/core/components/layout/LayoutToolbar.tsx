import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { observer } from 'mobx-react';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { Toolbar, ToolbarColumn, ToolbarProps, ToolbarSpacer } from 'components/toolbar';
import { DynamicContent, isDynamicChildren } from 'components/dynamic-content';
import { TunnelPlaceholder } from 'components/tunnel';
import { Affix } from 'components/affix';
import posed from 'react-pose';
import { observe, reaction } from 'mobx';

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

    public componentDidMount(): void {
        let listener = change => {
            log('observe change', change);
        };
        // reaction(this.store.layout.toolbar.left, listener);
        reaction(
            ()=>this.store.layout.toolbar.right.length,
            (arg, r) => {
                log('reaction',{arg,r,self:this})
                this.forceUpdate(()=>this.forceUpdate())
            }, {name: 'toolbarrightlen'});
    }

    render() {
        const { children, ...props } = this.props;

        let content: any = this.props.children;
        if ( ! this.props.children && isDynamicChildren(this.store.layout.toolbar.children) ) {
            content = <DynamicContent children={this.store.layout.toolbar.children}/>;
        }
        if ( this.props.children && isDynamicChildren(this.props.children) ) {
            content = <DynamicContent children={this.props.children}/>;
        }
        if ( ! this.props.children ) {
            content = [
                <ToolbarColumn key="left">
                    <TunnelPlaceholder id='layout-toolbar-left' delay={300} multiple/>
                    <DynamicContent children={this.store.layout.toolbar.left}/>
                </ToolbarColumn>,
                <ToolbarSpacer key="spacer"/>,
                <ToolbarColumn key="right">
                    <TunnelPlaceholder id='layout-toolbar-right' delay={300} multiple/>
                    <DynamicContent children={this.store.layout.toolbar.right}/>
                </ToolbarColumn>,
            ];
        }
        return (
            <Toolbar {...props}>
                {content}
            </Toolbar>
        );
        return (
            <Affix enabled={this.store.layout.toolbar.fixed}>
                <ToolbarContainer ref={this.props.containerRef}>
                    <Toolbar {...props}>
                        {content}
                    </Toolbar>
                </ToolbarContainer>
            </Affix>
        );
    }
}
