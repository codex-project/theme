import React, { Component, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { lazyInject } from 'ioc';
import { ComponentRegistry } from 'classes/ComponentRegistry';
import { merge } from 'lodash';
import { h } from 'classes/Hyper';
import { warn } from 'utils/general';
import { Config } from 'classes/Config';
import { Application } from 'classes/Application';
import { Store } from 'stores';
import { toJS } from 'mobx';
import { DynamicContentChildren, isDynamicChildren } from 'components/dynamic-content/types';


export interface DynamicContentProps {
    children?: DynamicContentChildren

}


@hot(module)
export class DynamicContent extends Component<DynamicContentProps> {
    @lazyInject('app') app: Application;
    @lazyInject('store') store: Store;
    @lazyInject('components') components: ComponentRegistry;

    static displayName                                = 'DynamicContent';
    static defaultProps: Partial<DynamicContentProps> = {
        children: [],
    };
    state: { children: any[] }                        = { children: this.transform(toJS(this.props.children)) };

    updateChildren(cb?: () => void): this {
        this.setState({ children: this.transform(toJS(this.props.children)) }, cb);
        return this;
    }

    transform(children: DynamicContentChildren) {

        return children
            .filter(child => {
                let has = this.components.has(child.component.toString());
                if ( ! has ) {
                    warn(`Could not find component [${child.component}] in DynamicContent`);
                }
                return has;
            })
            .map((child, i) => {
                let { component, children, ...props } = child;
                let { id, Component, options }        = this.components.get(component.toString());
                if ( isDynamicChildren(children) ) {
                    children = this.transform(children || []);
                }
                let childProps:any = merge(
                    { },
                    options.defaultProps,
                    props,
                    { children },
                );
                let config     = new Config({});
                config.set('app', this.app);
                config.set('store', this.store);
                Object.keys(childProps)
                    .filter(key => typeof childProps[ key ] === 'string')
                    .forEach(key => {
                        try {
                            config.set(`component.${key}`, childProps[ key ]);
                            let value = config.get(`component.${key}`, childProps[ key ]);
                            if ( childProps[ key ] !== value ) {
                                childProps[ key ] = value;
                            }
                        } catch ( error ) {
                            warn(`DynamicContent compile error on [${key}] of component [${component}]`, { error, childProps, component: this });
                        }
                    });
                childProps.key = component + '.' + i;
                return h(component as any, childProps as any, childProps.children as any);
            });
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
