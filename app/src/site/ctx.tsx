import React, { Fragment } from 'react';
import { api } from '@codex/api';
import { lazyInject, Store } from '@codex/core';

type ProjectContext = Partial<api.Project>
type RevisionContext = Partial<api.Revision>
type DocumentContext = Partial<api.Document>

const ProjectCtx  = React.createContext<ProjectContext>(null);
const RevisionCtx = React.createContext<RevisionContext>(null);
const DocumentCtx = React.createContext<DocumentContext>(null);

export class Project extends React.Component<{ key: string }> {
    @lazyInject('store') store: Store;

    render() {
        return <ProjectCtx.Provider value={this.store.project}>{this.props.children}</ProjectCtx.Provider>;
    }
}

export class Revision extends React.Component<{ key: string }> {
    @lazyInject('store') store: Store;

    render() {
        return <RevisionCtx.Provider value={this.store.revision}>{this.props.children}</RevisionCtx.Provider>;
    }
}

export class Document extends React.Component<{ key: string }> {
    @lazyInject('store') store: Store;

    render() {
        return <DocumentCtx.Provider value={this.store.document}>{this.props.children}</DocumentCtx.Provider>;
    }
}
