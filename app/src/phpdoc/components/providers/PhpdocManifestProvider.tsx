import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { PhpdocManifest, PhpdocStore } from '../../logic';
import { createObservableContext, lazyInject } from '@codex/core';
import { action, observable } from 'mobx';
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

    @action setManifest(manifest: PhpdocManifest) {this.manifest = manifest;}

    state: { project: string, revision: string } = { project: null, revision: null };

    async update() {
        const { props, state }      = this;
        const { project, revision } = props;
        if ( state.project === project && state.revision === revision ) {
            return;
        }
        const manifest = await this.store.fetchManifest(project, revision);
        this.setManifest(manifest);
        this.setState({ project, revision });
    }

    public componentDidMount(): void {
        this.update();
    }

    render() {
        const { children, ...props } = this.props;

        return (
            <PhpdocManifestContext.Provider value={{ manifest: this.manifest }}>
                {this.manifest ? children : null}
            </PhpdocManifestContext.Provider>
        );
    }
}

export function withPhpdocManifest() {
    return function <T>(TargetComponent: T): T {
        class PhpdocManifestHOC extends Component<any> {
            render() {
                const { ...props } = this.props;

                return (
                    <PhpdocManifestContext.Consumer>
                        {context => context.manifest ? React.createElement(TargetComponent as any, { manifest: context.manifest, ...props }) : null}
                    </PhpdocManifestContext.Consumer>
                );
            }
        }

        return hoistNonReactStatics(PhpdocManifestHOC,TargetComponent as any) as any;
    };
}
