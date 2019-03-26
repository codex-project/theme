import { FQSEN, IFQSEN, PhpdocFile, PhpdocManifest, PhpdocStore } from '../../logic';
import { lazyInject } from '@codex/core';
import React, { Component } from 'react';

export interface IManifestCtx {
    manifest: PhpdocManifest
}

export const ManifestContext = React.createContext<IManifestCtx>({ manifest: null });
ManifestContext.displayName  = 'ManifestContext';

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
    mounted: boolean;

    async update() {
        const { props, state }      = this;
        const { project, revision } = props;
        if ( state.manifest && state.manifest.project === project && state.manifest.revision === revision ) {
            return;
        }
        this.store.fetchManifest(project, revision).then(manifest => {
            if ( !this.mounted ) {
                return;
            }
            this.setState({ manifest });
        });
    }

    public componentDidMount(): void {
        this.mounted = true;
        this.update();
    }

    public componentWillUnmount(): void {
        this.mounted = false;
    }

    render() {
        const { children, ...props } = this.props;

        return (
            <ManifestContext.Provider value={{ manifest: this.state.manifest }}>
                {this.state.manifest ? children : props.forceRenderChildren ? children : null}
            </ManifestContext.Provider>
        );
    }
}


export interface IFQSENComponentCtx {
    manifest: PhpdocManifest
    file: PhpdocFile
    fqsen: FQSEN
}


export const FQSENComponentContext = React.createContext<IFQSENComponentCtx>({ manifest: null, file: null, fqsen: null });
FQSENComponentContext.displayName  = 'FQSENComponentContext';

export interface FQSENComponentProps {
    fqsen: IFQSEN
    file?: PhpdocFile
}

export function FQSENComponent(contextual: boolean = false) {
    return function <T>(TargetComponent: T): T {
        class HOC extends Component<FQSENComponentProps> {
            static displayName                        = `FQSENHOC(${TargetComponent[ 'name' ] || TargetComponent.constructor.name || TargetComponent.toString()})`;
            static WrappedComponent                   = TargetComponent;
            static contextType                        = ManifestContext;
            context!: React.ContextType<typeof ManifestContext>;
            state: { fqsen: FQSEN, file: PhpdocFile } = { fqsen: null, file: null };
            mounted: boolean                          = false;

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
                    if ( ! this.mounted ) {
                        return;
                    }
                    return this.setState({ file: this.props.file });
                }
                this.context.manifest.fetchFile(this.state.fqsen.slashEntityName).then(file => {
                    if ( ! this.mounted ) {
                        return;
                    }
                    this.setState({ file });
                });
            }

            componentDidMount(): void {
                this.mounted = true;
                this.updateFile();
            }

            componentWillUnmount(): void {
                this.mounted = false;
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
                    <FQSENComponentContext.Provider value={{ manifest: this.context.manifest, file: this.state.file, fqsen: this.state.fqsen }}>
                        <If condition={this.state.file}>
                            {React.createElement(TargetComponent as any, props, children)}
                        </If>
                    </FQSENComponentContext.Provider>
                );
            }
        }

        return HOC as any;
    };
}
