import React, { ReactNode } from 'react';
import { lazyInject, renderLoading, SpinProps } from '@codex/core';
import { FQNS, PhpdocFile, PhpdocStore } from '../logic';
import { PhpdocContentContext } from './PhpdocContent';
import { isString } from 'lodash';
import { action, computed, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';


const log = require('debug')('components:PhpdocFileContent');

export interface PhpdocFileContext {
    file: PhpdocFile
}

export const PhpdocFileComponentContext = React.createContext<PhpdocFileContext>({ manifest: null, file: null, fqns: null });

export interface PhpdocFileComponentBaseProps {
    fqns?: string | FQNS
    file?: PhpdocFile
    loader?: SpinProps
}

export interface PhpdocFileComponentProps extends PhpdocFileComponentBaseProps {
    children: (value: PhpdocFile) => ReactNode;
}

@observer
export class PhpdocFileComponent extends React.Component<PhpdocFileComponentProps> {
    static displayName                                     = 'PhpdocFileComponent';
    static defaultProps: Partial<PhpdocFileComponentProps> = {
        loader  : {},
        children: () => null,
    };
    static Context: typeof PhpdocFileComponentContext      = PhpdocFileComponentContext;
    static contextType                                     = PhpdocContentContext;
    context!: React.ContextType<typeof PhpdocContentContext>;
    @lazyInject('store.phpdoc') phpdoc: PhpdocStore;

    @observable private _file = null;
    @observable loading       = false;

    @computed get fqns(): FQNS {
        if ( this.props.fqns ) {
            return isString(this.props.fqns) ? FQNS.from(this.props.fqns) : this.props.fqns;
        } else if ( this.file ) {
            return this.file.fqns;
        }
        return null;
    }

    @computed get file(): PhpdocFile {
        if ( this.props.file ) {
            return this.props.file;
        }
        return this._file;
    }


    @computed get showLoader(): boolean {return this.loading || ! this.file;}

    @action update() {
        if ( ! this.context.manifest ) {
            return;
        }
        if ( ! this.props.file && this.props.fqns ) {
            const setFile = file => runInAction(() => {
                this._file   = file;
                this.loading = false;
            });
            if ( ! this.file ) {
                this.loading = true;
                this.context.manifest.fetchFile(this.fqns).then(setFile);
            }
            if ( this.file && this.file.fqns && ! this.file.fqns.equals(this.fqns) ) {
                this.loading = true;
                this.context.manifest.fetchFile(this.fqns).then(setFile);
            }
        }
    }

    public componentDidMount() {
        this.update();
    }

    public componentDidUpdate(prevProps, prevState, snapshot?) {
        this.update();
    }

    render() {
        const { children } = this.props;

        return (
            <PhpdocFileComponentContext.Provider value={{ file: this.file }}>
                <If condition={this.showLoader}>
                    {this.renderLoader()}
                </If>
                <If condition={! this.showLoader}>
                    {children(this.file)}
                </If>
            </PhpdocFileComponentContext.Provider>
        );
    }

    renderLoader() {
        const { loader }                           = this.props;
        const { delay, prefixCls, ...loaderProps } = loader;
        return renderLoading({
            loadingText: null,
            spin       : {
                style    : { padding: 0, margin: 2, width: 100 },
                iconStyle: { fontSize: 'small' },
                size     : 'small',
                delay    : 300,
                ...loaderProps,
            },
        });
    }
}
