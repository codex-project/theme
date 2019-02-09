import { FQNS, PhpdocFile, PhpdocManifest, PhpdocStore } from '../../logic';
import { lazyInject } from '@codex/core';
import React, { Component } from 'react';

export interface IManifestCtx {
    manifest: PhpdocManifest
}

export const ManifestCtx = React.createContext<IManifestCtx>({ manifest: null });

export interface ManifestProviderBaseProps {
    project: string
    revision: string
}

export interface ManifestProviderProps extends ManifestProviderBaseProps {
    forceRenderChildren?: boolean
}

export class ManifestProvider extends Component<ManifestProviderProps> {
    static displayName                                  = 'ManifestProvider';
    static defaultProps: Partial<ManifestProviderProps> = {};
    @lazyInject('store.phpdoc') store: PhpdocStore;

    state: { manifest: PhpdocManifest } = { manifest: null };
    unmounting: boolean;

    async update() {
        const { props, state }      = this;
        const { project, revision } = props;
        if ( state.manifest && state.manifest.project === project && state.manifest.revision === revision ) {
            return;
        }
        this.store.fetchManifest(project, revision).then(manifest => {
            if ( ! this.unmounting ) {
                this.setState({ manifest });
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
            <ManifestCtx.Provider value={{ manifest: this.state.manifest }}>
                {this.state.manifest ? children : props.forceRenderChildren ? children : null}
            </ManifestCtx.Provider>
        );
    }
}


export interface IFQNSComponentCtx {
    manifest: PhpdocManifest
    file: PhpdocFile
    fqns: FQNS
}


export const FQNSComponentCtx = React.createContext<IFQNSComponentCtx>({ manifest: null, file: null, fqns: null });


export function FQNSComponent() {
    return function <T>(TargetComponent: T): T {
        class HOC extends Component<any> {
            static displayName      = 'FQNSHOC';
            static WrappedComponent = TargetComponent;
            static contextType      = ManifestCtx;
            context!: React.ContextType<typeof ManifestCtx>;

            state: { fqns: FQNS, file: PhpdocFile } = { fqns: null, file: null };

            static getDerivedStateFromProps(nextProps, prevState) {
                return { fqns: FQNS.from(nextProps.fqns) };
            }

            public componentDidMount(): void {
                this.context.manifest.fetchFile(this.state.fqns.slashEntityName).then(file => {
                    this.setState({ file });
                });
            }

            render() {
                const { children, ...props } = this.props;
                return (
                    <FQNSComponentCtx.Provider value={{ manifest: this.context.manifest, file: this.state.file, fqns: this.state.fqns }}>
                        <If condition={this.state.file}>
                            {React.createElement(TargetComponent as any, props, children)}
                        </If>
                    </FQNSComponentCtx.Provider>
                );
            }
        }

        return HOC as any;
    };
}
