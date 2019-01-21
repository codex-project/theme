import React from 'react';
import { action, computed, observable, toJS } from 'mobx';
import { PhpdocFile, PhpdocStore, Query } from '../logic';
import { isFunction, isNumber, isString } from 'lodash';
import { lazyInject, Spin, SpinProps } from '@codex/core';
import { PhpdocContent } from './PhpdocContent';
import { classes } from 'typestyle';
import { PhpdocManifestFile } from '@codex/api';
import { FQNS } from '../logic/FQNS';


const log = require('debug')('phpdoc:components:PhpdocComponent');

export interface PhpdocComponentProps {
    query?: string | Query
    fqns?: string | FQNS
    file?: PhpdocFile
    loader?: SpinProps
    boxed?: boolean
}

export interface PhpdocComponentState {
    file?: PhpdocFile
    query?: string | Query
    fqns?: string | FQNS
}

export class PhpdocComponent<T = {}, P extends PhpdocComponentProps = PhpdocComponentProps & T> extends React.Component<P, PhpdocComponentState> {
    static contextType             = PhpdocContent.Context;
    context!: React.ContextType<typeof PhpdocContent.Context>;
    @lazyInject('store.phpdoc') store: PhpdocStore;
    @observable file: PhpdocFile   = null;
    @observable isLoading: boolean = true;

    // @computed get manifest(): PhpdocManifest {return this.context.manifest;}

    state = { query: null };

    @computed get fileJS(): PhpdocFile {return toJS(this.file);}

    @action setLoading(isLoading: boolean) { this.isLoading = isLoading;}

    @action setFile(file: PhpdocFile) {
        this.file = file;
        this.onFileChange();
    }

    static getDerivedStateFromProps(nextProps: PhpdocComponentProps, prevState: PhpdocComponentState) {
        let state = prevState || {};
        let query = nextProps.query;
        if ( ! query && nextProps.file ) {
            query = Query.from(nextProps.file.entity.full_name);
        }
        if ( ! prevState || ! prevState.query || prevState.query !== query || ! query ) {
            state.query = isString(query) ? Query.from(query) : Query.fromHash();
        }
        return state;
    }

    onFileChange() {}

    onQueryChange() {}

    componentDidMount() {
        this._updateFile();
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<PhpdocComponentState>, snapshot?: any): void {
        if ( this.props.query !== prevProps.query || this.props.file !== prevProps.file ) {
            this._updateFile();
        }
        if ( this.props.query && prevProps.query && this.props.query !== prevProps.query ) {
            this.onQueryChange();
        }
    }

    protected className(...classNames: any[]) {
        return classes(...[ this.props[ 'className' ], this.props.boxed && 'boxed' ].concat(classNames).filter(Boolean));
    }

    @action
    protected async _updateFile() {
        if ( ! this.props.file && ! this.state.query ) return false;
        this.setLoading(true);
        if ( this.props.file ) {
            this.setFile(this.props.file);
            this.setLoading(false);
            return;
        }

        let mfile: PhpdocManifestFile;
        if ( this.context.manifest.files.has(this.state.query.slashEntityName) ) {
            mfile = this.context.manifest.files.get(this.state.query.slashEntityName);
        }
        if ( ! mfile || ! mfile.hash ) {
            throw new Error('Cannot update file, query entity does not exist in manifest files: ' + this.state.query.slashEntityName);
        }
        let file = await this.context.manifest.fetchFile(mfile.name);
        this.setFile(file);
        this.setLoading(false);
    }

    protected renderWithLoader(isLoading: boolean, content)
    protected renderWithLoader(content)
    protected renderWithLoader(...args: any[]) {
        let content   = args[ args.length - 1 ];
        let isLoading = (args.length > 1 ? args[ 0 ] : false) || this.isLoading;

        if ( ! isLoading ) {
            return isFunction(content) ? content(this.props) : content;
        }
        let props   = this.props.loader || {};
        props.delay = isNumber(props.delay) ? props.delay : 0;

        return (
            <Spin {...props} />
        );
    }
}

