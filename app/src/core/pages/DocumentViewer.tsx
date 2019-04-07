import React from 'react';
import { Api, api } from '@codex/api';
import { observer } from 'mobx-react';
import { observable, runInAction, toJS, transaction } from 'mobx';
import { lazyInject } from 'ioc';
import { HtmlParser } from 'classes/HtmlParser';
import { Store } from 'stores';
import Helmet from 'react-helmet';
import { Application } from 'classes/Application';
import { hot } from 'react-hot-loader';

const uuid = require('uuid').v4;

const log = require('debug')('pages:DocumentViewer');

export interface DocumentViewerProps extends React.HTMLAttributes<HTMLDivElement> {
    project: string
    revision: string
    document: string
}


export interface RunScriptProps {
    scripts: any[]
}

export class Scripts extends React.Component<RunScriptProps> {
    static displayName                           = 'RunScript';
    static defaultProps: Partial<RunScriptProps> = {};
    state                                        = { done: false };

    public componentDidMount(): void {
        if ( this.state.done ) {
            return;
        }
        const head = window.document.head;
        this.props.scripts.forEach(script => {
            let s  = window.document.createElement('script');
            s.type = 'text/javascript';
            s.src  = script;
            head.append(s);
            this.setState({ done: true });
        });
    }

    render() {
        const { children, ...props } = this.props;
        return null;
    }
}

@hot(module)
@observer
export class DocumentViewer extends React.Component<DocumentViewerProps> {
    @lazyInject('api') api: Api;
    @lazyInject('app') app: Application;
    @lazyInject('htmlparser') htmlParser: HtmlParser;
    @lazyInject('store') store: Store;
    static displayName = 'DocumentViewer';

    @observable document: api.Document = null;
    @observable mounted                = false;

    async componentDidMount() {
        const { children, project, revision, document, ...props } = this.props;
        this.fetch(project, revision, document).then(document => {
            this.ensureToolbarRefreshButton();
        });
    }

    async refetch(){
        log('refetching', this.store,this);
        this.store
            .setDocument(null)
            .cancelPrevFetch();
        this.store.fetched.unsetDocument(this.props.project, this.props.revision, this.props.document);
        let document=await this.fetch(this.props.project, this.props.revision, this.props.document);
        this.ensureToolbarRefreshButton()
        log('refetched', {document,store:this.store,self:this});
        return document
    }

    async fetch(project, revision, document) {
        return this.store.fetchDocument(project, revision, document).then(async document => {
            runInAction(() => {
                this.document = toJS(document);
                this.mounted  = true;
            });
            return document;
        });
    }

    protected ensureToolbarRefreshButton() {
        let id = 'debug-refresh-document';
        if ( ! this.store.layout.toolbar.right.find(item => item.id === id) ) {
            transaction(() => {
                log('add toolbar refresh button', this.store.document);
                this.store.layout.toolbar.right.push({
                    id,
                    component : 'c-button',
                    children  : 'Refresh',
                    borderless: true,
                    type      : 'toolbar',
                    icon      : 'refresh',
                    onClick   : async e => {
                        log('Refresh onClick', this);
                        this.refetch();
                    },
                });
                this.store.layout.toolbar.right = this.store.layout.toolbar.toJS('right');
            });
        }
    }

    render() {
        const { children, ...props } = this.props;

        let content = null;
        if ( this.document && this.document.content ) {
            try {
                content = this.htmlParser.parse(this.document.content);
                content = (
                    <div id="document">
                        <Helmet>
                            <title>{this.document.title || this.document.key}</title>
                        </Helmet>
                        {content}
                        <If condition={this.document.scripts}>
                            <Scripts scripts={this.document.scripts}/>
                        </If>
                    </div>
                );
            } catch ( e ) {
                console.warn(e);
            }
        }
        return content;
    }
}

