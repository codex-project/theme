import React, { ReactNode } from 'react';
import { action, computed, observable, toJS } from 'mobx';
import { FQNS, PhpdocStore } from '../logic';
import { PhpdocMethod } from '../logic/types';
import { lazyInject, renderLoading, SpinProps } from '@codex/core';
import { observer } from 'mobx-react';
import { PhpdocFileComponent, PhpdocFileComponentContext } from './PhpdocFileComponent';
import { isString } from 'lodash';

const log = require('debug')('components:PhpdocMethodComponent');

export interface PhpdocMethodContext {
    method: PhpdocMethod
}

export const PhpdocMethodComponentContext = React.createContext<PhpdocMethodContext>({ method: null });

export interface PhpdocMethodComponentBaseProps {
    fqns?: string | FQNS
    method?: PhpdocMethod
    loader?: SpinProps | false
}

export interface PhpdocMethodComponentProps extends PhpdocMethodComponentBaseProps {
    children: ReactNode | ((value: PhpdocMethod) => ReactNode)
}

export function withMethodComponent() {
    return Component => {
        class ComponentHOC extends React.PureComponent<any> {

            render() {
                const { method, fqns, loader, children, ...props } = this.props;
                return (
                    <PhpdocFileComponent fqns={fqns} loader={loader}>
                        <PhpdocMethodComponent method={method} fqns={fqns} loader={loader}>
                            {/*{method => React.cloneElement(React.Children.only(children), { ...props, method })}*/}
                            {/*{method => <Component method={method} fqns={fqns} loader={loader} {...props}>{children}</Component>}*/}
                            <Component fqns={fqns} loader={loader} {...props}>{children}</Component>
                        </PhpdocMethodComponent>
                    </PhpdocFileComponent>
                );
            }
        };
        return ComponentHOC as any;
    };
}

@observer
export class PhpdocMethodComponent extends React.Component<PhpdocMethodComponentProps> {
    static displayName                                       = 'PhpdocMethodComponent';
    static defaultProps: Partial<PhpdocMethodComponentProps> = {
        loader  : {},
        children: () => null,
    };
    static Context: typeof PhpdocMethodComponentContext      = PhpdocMethodComponentContext;
    static contextType                                       = PhpdocFileComponentContext;
    context!: React.ContextType<typeof PhpdocFileComponentContext>;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;

    @observable private _method = null;
    @observable loading         = false;

    @computed get fqns(): FQNS {
        if ( this.props.fqns ) {
            return isString(this.props.fqns) ? FQNS.from(this.props.fqns) : this.props.fqns;
        } else if ( this.method ) {
            return this.method.fqns;
        }
        return null;
    }

    @computed get method(): PhpdocMethod {
        if ( this.props.method ) {
            return this.props.method;
        }
        return this._method;
    }


    @computed get showLoader(): boolean {return this.loading || ! this.method;}

    @action update() {
        if ( ! this.context.file ) {
            return;
        }
        if ( ! this.props.method && this.props.fqns ) {
            if ( ! this.method ) {
                this.loading = true;
                this._method = this.context.file.entity.methods.get(this.fqns.memberName);
            }
            if ( this.method && this.method.fqns && ! this.method.fqns.equals(this.fqns) ) {
                this.loading = true;
                this._method = this.context.file.entity.methods.get(this.fqns.memberName);
            }
            this.loading = false;
        }
    }

    public componentDidMount() {
        this.update();
    }

    public componentDidUpdate(prevProps, prevState, snapshot?) {
        this.update();
    }

    render() {
        const { children } = this.props;

        return (
            <PhpdocMethodComponentContext.Provider value={{ method: toJS(this.method) }}>
                <If condition={this.showLoader}>
                    {this.renderLoader()}
                </If>
                <If condition={! this.showLoader}>
                    {typeof children === 'function' ? (children as any)(toJS(this.method)) : children}
                </If>
            </PhpdocMethodComponentContext.Provider>
        );
    }

    renderLoader() {
        const { loader } = this.props;
        if ( loader === false ) {
            return null;
        }
        const { delay, prefixCls, ...loaderProps } = loader;
        return renderLoading({
            loadingText: null,
            spin       : {
                style    : { padding: 0, margin: 2, width: 100 },
                iconStyle: { fontSize: 'small' },
                size     : 'small',
                delay    : 300,
                ...loaderProps,
            },
        });
    }


}
