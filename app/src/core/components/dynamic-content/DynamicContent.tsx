import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from 'ioc';
import { ComponentRegistry } from 'classes/ComponentRegistry';
import { merge } from 'lodash';
import { h } from 'classes/Hyper';
import { keysToCamelCase, warn } from 'utils/general';
import { Application } from 'classes/Application';
import { Store } from 'stores';
import { DynamicContentChildren, isDynamicChildren } from 'components/dynamic-content/types';
import { htmlElements } from 'utils/styled';
import { HtmlParser } from 'classes/HtmlParser';
import { Observer, observer } from 'mobx-react';
import { ObjectStringCompiler } from 'classes/ObjectStringCompiler';
import { observe, toJS } from 'mobx';

const log = require('debug')('components:dynamic-content');

export interface DynamicContentProps {
    children?: DynamicContentChildren

}


@hot(module)
@observer
export class DynamicContent extends Component<DynamicContentProps> {
    @lazyInject('app') app: Application;
    @lazyInject('store') store: Store;
    @lazyInject('components') components: ComponentRegistry;
    @lazyInject('htmlparser') htmlParser: HtmlParser;

    static displayName                                = 'DynamicContent';
    static defaultProps: Partial<DynamicContentProps> = {
        children: [],
    };
    state: { children: any[]}          = { children: this.transform(toJS(this.props.children)) };

    updateChildren(cb?: () => void): this {
        let children = this.transform(toJS(this.props.children));
        // let children = this.transform(this.props.children);
        log('updateChildren', 'propsChildren:', toJS(this.props.children), 'stateChildren:', this.state.children, 'result:', children);
        this.setState({ children }, cb);
        return this;
    }

    osc: ObjectStringCompiler;

    compileProps(childProps = {}) {
        if ( ! this.osc ) {
            this.osc = new ObjectStringCompiler();
        }
        return this.osc.compile(childProps, true);
    };

    transform(children: DynamicContentChildren) {
        if ( ! Array.isArray(children) ) {
            let isKeyObject = Object.keys(children).filter(k => ! isNaN(k as any)).length > 0;
            if ( isKeyObject ) {
                children = Object.values(children);
            } else {
                children = [];
            }
        }
        children = children
            .filter(child => {
                let has = this.components.has(child.component.toString()) || htmlElements.includes(child.component.toString());
                if ( ! has ) {
                    warn(`Could not find component [${child.component}] in DynamicContent`);
                }
                return has;
            })
            .map((child, i) => {
                let { component, children, ...props } = child;
                let options                           = { defaultProps: {} };
                if ( htmlElements.includes(component.toString()) ) {

                }
                if ( this.components.has(component.toString()) ) {
                    let comp = this.components.get(component.toString());
                    options  = { ...options, ...comp.options };
                }
                if ( isDynamicChildren(children) ) {
                    children = this.transform(children || []);
                }
                let childProps: any = merge(
                    {},
                    options.defaultProps,
                    props,
                    { children },
                );
                childProps          = this.compileProps(childProps);
                childProps.key      = component + '.' + i;
                if ( childProps.style ) {
                    childProps.style = keysToCamelCase(childProps.style);
                }
                return h(component as any, childProps as any, childProps.children as any); // return <Observer key={childProps.key} render={() => h(component as any, childProps as any, childProps.children as any)}/>;
            }) as any;

        return children;
    }

    public componentDidUpdate(prevProps: Readonly<DynamicContentProps>, prevState: Readonly<{}>, snapshot?: any): void {
         if ( prevProps.children !== this.props.children ) {
            this.updateChildren();
        }
    }

    render() {
        let { children: _children, ...props } = this.props;
        let { children }                      = this.state;
        // return <Observer {...props} render={() => children}/>;
        return <Fragment>{children}</Fragment>;
    }
}
