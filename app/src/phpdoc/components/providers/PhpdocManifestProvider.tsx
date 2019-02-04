import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { PhpdocManifest, PhpdocStore } from '../../logic';
import { createObservableContext, lazyInject } from '@codex/core';
import { observable, runInAction } from 'mobx';
import hoistNonReactStatics from 'hoist-non-react-statics';


export interface IPhpdocManifestContext {
    manifest: PhpdocManifest
}

const PhpdocManifestContext       = createObservableContext<IPhpdocManifestContext>({ manifest: null });
PhpdocManifestContext.displayName = 'PhpdocManifestContext';

export interface PhpdocManifestProviderProps {
    project: string
    revision: string
}


@observer
export class PhpdocManifestProvider extends Component<PhpdocManifestProviderProps> {
    static displayName                                        = 'PhpdocManifestProvider';
    static defaultProps: Partial<PhpdocManifestProviderProps> = {};
    static Context: typeof PhpdocManifestContext              = PhpdocManifestContext;

    @lazyInject('store.phpdoc') store: PhpdocStore;
    @observable manifest: PhpdocManifest = null;
    unmounting: boolean;

    async update() {
        const { props, state }      = this;
        const { project, revision } = props;
        if ( this.manifest && this.manifest.project === project && this.manifest.revision === revision ) {
            return;
        }
        this.store.fetchManifest(project, revision).then(manifest => {
            if ( ! this.unmounting ) {
                runInAction(() => {
                    this.manifest = manifest;
                });
            }
        });
    }

    public componentDidMount(): void {
        this.update();
    }

    public componentWillUnmount(): void {
        this.unmounting = true;
    }

    render() {
        const { children, ...props } = this.props;

        return (
            <PhpdocManifestContext.Provider value={{ manifest: this.manifest }}>
                {/*{this.manifest ? children : null}*/}
                {children}
            </PhpdocManifestContext.Provider>
        );
    }
}

export function withPhpdocManifest(consumer: boolean = true, provider: boolean = false) {
    return function <T>(TargetComponent: T): T {
        class PhpdocManifestHOC extends Component<any> {
            render() {
                const { children, ...props } = this.props;
                if ( consumer && provider ) {
                    return (
                        <PhpdocManifestProvider project={this.props.project} revision={this.props.revision}>
                            <PhpdocManifestContext.Consumer>
                                {context => context.manifest ? React.createElement(TargetComponent as any, { manifest: context.manifest, ...props }, children) : null}
                            </PhpdocManifestContext.Consumer>
                        </PhpdocManifestProvider>
                    );
                }
                if ( consumer ) {
                    return (
                        <PhpdocManifestContext.Consumer>
                            {context => context.manifest ? React.createElement(TargetComponent as any, { manifest: context.manifest, ...props }, children) : null}
                        </PhpdocManifestContext.Consumer>
                    );
                }
                if ( provider ) {
                    return (
                        <PhpdocManifestProvider project={this.props.project} revision={this.props.revision}>
                            {React.createElement(TargetComponent as any, props, children)}
                        </PhpdocManifestProvider>
                    );
                }
            }
        }

        return hoistNonReactStatics(PhpdocManifestHOC, TargetComponent as any) as any;
    };
}
