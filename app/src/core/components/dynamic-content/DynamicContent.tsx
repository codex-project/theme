import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from 'ioc';
import { ComponentRegistry } from 'classes/ComponentRegistry';
import { merge } from 'lodash';
import { h } from 'classes/Hyper';
import { keysToCamelCase, warn } from 'utils/general';
import { Config } from 'classes/Config';
import { Application } from 'classes/Application';
import { Store } from 'stores';
import { DynamicContentChildren, isDynamicChildren } from 'components/dynamic-content/types';
import { htmlElements } from 'utils/styled';
import { HtmlParser } from 'classes/HtmlParser';
import { observer } from 'mobx-react/custom';
import { Observer } from 'mobx-react';

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
    state: { children: any[] }                        = { children: this.transform(this.props.children) };

    updateChildren(cb?: () => void): this {
        // let children = this.transform(toJS(this.props.children));
        let children = this.transform(this.props.children);
        log('updateChildren', 'propsChildren:', this.props.children, 'stateChildren:', this.state.children, 'result:', children);
        this.setState({ children }, cb);
        return this;
    }

    config:Config

    compileProps(childProps) {
        if(!this.config){
            this.config = new Config({});
        }
        this.config.set('app', this.app);
        this.config.set('store', this.store);
        Object.keys(childProps)
            .filter(key => typeof childProps[ key ] === 'string' || typeof childProps[ key ] === 'object')
            .forEach(key => {
                if ( typeof childProps[ key ] === 'object' ) {
                    childProps[ key ] = this.compileProps(childProps[ key ]);
                    return;
                }
                try {
                    this.config.set(`component.${key}`, childProps[ key ]);
                    let value = this.config.get(`component.${key}`, childProps[ key ]);
                    if ( childProps[ key ] !== value ) {
                        childProps[ key ] = value;
                    }
                } catch ( error ) {
                    warn(`DynamicContent compile error on [${key}] of component`, { error, childProps, component: this });
                }
            });
        return childProps;
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
                // return <Observer key={childProps.key} render={() => h(component as any, childProps as any, childProps.children as any)}/>;

                return h(component as any, childProps as any, childProps.children as any);
            }) as any;

        return children;
    }

    public componentDidUpdate(prevProps: Readonly<DynamicContentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if ( prevProps.children !== this.props.children ) {
            this.updateChildren();
        }
    }

    render() {
        // let { ...props } = this.props;
        let { children } = this.state;
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    }
}
