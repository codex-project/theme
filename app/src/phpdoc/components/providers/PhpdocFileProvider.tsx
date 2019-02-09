import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { FQSEN, PhpdocFile, PhpdocStore } from '../../logic';
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
    fqsen: string | FQSEN
}

// @withPhpdocManifest()
@observer
export class PhpdocFileProvider extends Component<PhpdocFileProviderProps> {
    static displayName                                    = 'PhpdocFileProvider';
    static defaultProps: Partial<PhpdocFileProviderProps> = {};
    static Context: typeof PhpdocFileContext              = PhpdocFileContext;
    static contextType                                    = PhpdocManifestProvider.Context.Context;
    context!: React.ContextType<typeof PhpdocManifestProvider.Context>;
    state: { fqsen: FQSEN }                                = { fqsen: null };
    @lazyInject('store.phpdoc') store: PhpdocStore;
    @observable file: PhpdocFile                          = null;

    @action setFile(file: PhpdocFile) {this.file = file;}

    async update() {
        const { state, context } = this;
        const { fqsen }           = state;
        const { manifest }       = context;

        const file = await manifest.fetchFile(fqsen.fullName);

        this.setFile(file);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return { fqsen: FQSEN.from(nextProps.fqsen) };
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
            static contextType=PhpdocFileContext.Context
            context!:React.ContextType<typeof PhpdocFileContext.Context>
            render() {
                let { children,...props } = this.props as any;
                if(!this.props.fqsen && this.context.file){
                    props.fqsen = this.context.file.fqsen
                }
                if ( consumer && provider ) {
                    if(!this.props.fqsen || (this.context.file && this.context.file.fqsen.equals(this.props.fqsen))){
                        return React.createElement(TargetComponent as any, props , children)
                    }
                    return (
                        <PhpdocFileProvider fqsen={this.props.fqsen}>
                            <PhpdocFileContext.Consumer>
                                {context => context.file ? React.createElement(TargetComponent as any, { file: context.file, ...props }, children) : null}
                            </PhpdocFileContext.Consumer>
                        </PhpdocFileProvider>
                    );
                }
                if ( consumer ) {
                    return (
                        <PhpdocFileContext.Consumer>
                            {context => context.file ? React.createElement(TargetComponent as any, { file: context.file, ...props }, children) : null}
                        </PhpdocFileContext.Consumer>
                    );
                }
                if ( provider ) {
                    if(!this.props.fqsen || (this.context.file && this.context.file.fqsen.equals(this.props.fqsen))){
                        return React.createElement(TargetComponent as any, props , children)
                    }
                    return (
                        <PhpdocFileProvider fqsen={this.props.fqsen}>
                            {React.createElement(TargetComponent as any, props, children)}
                        </PhpdocFileProvider>
                    );
                }
            }
        }
        return hoistNonReactStatics(PhpdocFileHOC,TargetComponent as any) as any;
    };
}
