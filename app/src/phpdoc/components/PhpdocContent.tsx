import React from 'react';
import { lazyInject } from '@codex/core';
import { PhpdocManifest, PhpdocStore } from '../logic';

export interface PhpdocContext {
    manifest: PhpdocManifest
}

export const PhpdocContentContext = React.createContext<PhpdocContext>({ manifest: null });

export interface PhpdocContentProps {
    project: string
    revision: string
}

export class PhpdocContent extends React.Component<PhpdocContentProps> {
    static displayName                          = 'PhpdocContent';
    static Context: typeof PhpdocContentContext = PhpdocContentContext;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;

    state: { manifest: PhpdocManifest } = { manifest: null };

    setManifest = (manifest: PhpdocManifest) => this.setState({ manifest });

    async update() {

        const { project, revision } = this.props;
        let manifest                = await this.phpdoc.fetchManifest(project, revision);
        this.setManifest(manifest);

    }

    public componentDidMount(): void {
        this.update();
    }

    public componentDidUpdate(prevProps: Readonly<PhpdocContentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        const { project, revision } = this.props;
        if ( prevProps.project !== project || prevProps.revision !== revision ) {
            this.update();
        }
    }

    render() {
        const { children } = this.props;
        const { manifest } = this.state;

        return (
            <PhpdocContentContext.Provider value={{ manifest }}>
                {/*{! manifest ? <span/> : children}*/}
                <If condition={manifest !== null}>
                    {children}
                </If>
            </PhpdocContentContext.Provider>
        );
    }
}
