import { FQSEN, IFQSEN, PhpdocFile, PhpdocManifest, PhpdocStore } from '../../logic';
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
    fqsen: FQSEN
}


export const FQNSComponentCtx = React.createContext<IFQNSComponentCtx>({ manifest: null, file: null, fqsen: null });

export interface FQNSComponentProps {
    fqsen:IFQSEN
    file?:PhpdocFile
}

export function FQNSComponent(contextual: boolean = false) {
    return function <T>(TargetComponent: T): T {
        class HOC extends Component<FQNSComponentProps> {
            static displayName                        = 'FQNSHOC';
            static WrappedComponent                   = TargetComponent;
            static contextType                        = ManifestCtx;
            context!: React.ContextType<typeof ManifestCtx>;
            state: { fqsen: FQSEN, file: PhpdocFile } = { fqsen: null, file: null };

            constructor(props: any, context: any) {
                super(props, context);
                if ( props.fqsen ) {
                    this.state.fqsen = FQSEN.from(props.fqsen);
                }
                if ( props.file ) {
                    this.state.file = props.file;
                }
            }

            updateFile() {
                if ( this.props.file ) {
                    return this.setState({ file: this.props.file });
                }
                this.context.manifest.fetchFile(this.state.fqsen.slashEntityName).then(file => {
                    this.setState({ file });
                });
            }

            componentDidMount(): void {
                this.updateFile();
            }

            componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{ fqsen: FQSEN, file: PhpdocFile }>, snapshot?: any): void {
                if ( prevProps.file && prevProps.file.hash !== this.props.file.hash ) {
                    this.updateFile();
                }
                if ( ! prevState.fqsen.equals(this.props.fqsen) ) {
                    this.setState({ fqsen: FQSEN.from(this.props.fqsen) }, () => this.updateFile());
                }
            }

            render() {
                const { children, ...props } = this.props;
                return (
                    <FQNSComponentCtx.Provider value={{ manifest: this.context.manifest, file: this.state.file, fqsen: this.state.fqsen }}>
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
