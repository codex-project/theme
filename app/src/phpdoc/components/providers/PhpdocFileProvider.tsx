import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { FQNS, PhpdocFile, PhpdocStore } from '../../logic';
import { createObservableContext, lazyInject } from '@codex/core';
import { action, observable } from 'mobx';
import { PhpdocManifestProvider, withPhpdocManifest } from './PhpdocManifestProvider';
import hoistNonReactStatics from 'hoist-non-react-statics';


export interface IPhpdocFileContext {
    file: PhpdocFile
}

const PhpdocFileContext       = createObservableContext<IPhpdocFileContext>({ file: null });
PhpdocFileContext.displayName = 'PhpdocFileContext';


export interface PhpdocFileProviderProps {
    fqns: string | FQNS
}

// @withPhpdocManifest()
@observer
export class PhpdocFileProvider extends Component<PhpdocFileProviderProps> {
    static displayName                                    = 'PhpdocFileProvider';
    static defaultProps: Partial<PhpdocFileProviderProps> = {};
    static Context: typeof PhpdocFileContext              = PhpdocFileContext;
    static contextType                                    = PhpdocManifestProvider.Context.Context;
    context!: React.ContextType<typeof PhpdocManifestProvider.Context>;
    state: { fqns: FQNS }                                 = { fqns: null };
    @lazyInject('store.phpdoc') store: PhpdocStore;
    @observable file: PhpdocFile                          = null;

    @action setFile(file: PhpdocFile) {this.file = file;}

    async update() {
        const { state, context } = this;
        const { fqns }           = state;
        const { manifest }       = context;

        const file = await manifest.fetchFile(fqns.fullName);

        this.setFile(file);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return { fqns: FQNS.from(nextProps.fqns) };
    }

    public componentDidMount(): void {
        this.update();
    }

    render() {
        const { children, ...props } = this.props;
        return (
            <PhpdocFileContext.Provider value={{ file: this.file }}>
                {this.file ? children : null}
            </PhpdocFileContext.Provider>
        );
    }
}

export function withPhpdocFile(consumer: boolean = true, provider: boolean = true) {
    return function <T>(TargetComponent: T): T {

        class PhpdocFileHOC extends Component<any> {
            render() {
                const { children,...props } = this.props;
                if ( consumer && provider ) {
                    return (
                        <PhpdocFileProvider fqns={this.props.fqns}>
                            <PhpdocFileContext.Consumer>
                                {context => context.file ? React.createElement(TargetComponent as any, { manifest: context.file, ...props }, children) : null}
                            </PhpdocFileContext.Consumer>
                        </PhpdocFileProvider>
                    );
                }
                if ( consumer ) {
                    return (
                        <PhpdocFileContext.Consumer>
                            {context => context.file ? React.createElement(TargetComponent as any, { manifest: context.file, ...props }, children) : null}
                        </PhpdocFileContext.Consumer>
                    );
                }
                if ( provider ) {
                    return (
                        <PhpdocFileProvider fqns={this.props.fqns}>
                            {React.createElement(TargetComponent as any, props, children)}
                        </PhpdocFileProvider>
                    );
                }
            }
        }
        return hoistNonReactStatics(PhpdocFileHOC,TargetComponent as any) as any;
    };
}
