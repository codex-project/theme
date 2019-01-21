import React from 'react';
import { hot, lazyInject } from '@codex/core';
import { PhpdocManifest, PhpdocStore } from '../logic';

interface PhpdocContext {
    manifest: PhpdocManifest
}

const Context = React.createContext<PhpdocContext>({ manifest: null });

export interface PhpdocContentProps {
    project: string
    revision: string
}

@hot(module)
export class PhpdocContent extends React.Component<PhpdocContentProps> {
    static displayName             = 'PhpdocContent';
    static Context: typeof Context = Context;
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
            <PhpdocContent.Context.Provider value={{ manifest }}>
                <If condition={manifest !== null}>
                    {children}
                </If>
            </PhpdocContent.Context.Provider>
        );
    }
}
