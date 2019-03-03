import * as React from 'react';
import { Api } from '@codex/api';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Helmet from 'react-helmet';
import posed from 'react-pose';
import { toJS } from 'mobx';
import { State } from 'router';
import { app, lazyInject } from 'ioc';
import { HtmlComponents } from 'classes/HtmlComponents';
import { Store } from 'stores';

const log = require('debug')('pages:DocumentPage');

export interface DocumentPageProps extends React.HTMLAttributes<HTMLDivElement> {
    routeState: State
    project: string
    revision: string
    document: string
}

const DocumentContainer = posed.div({
    enter: {
        opacity: 1
    },
    exit : {
        opacity   : 0
    },
});
@observer
export default class DocumentPage extends React.Component<DocumentPageProps> {
    @lazyInject('api') api: Api;
    @lazyInject('components') hc: HtmlComponents;
    @lazyInject('store') store: Store;

    static displayName = 'DocumentPage';

    static childContextTypes = { document: PropTypes.object };

    getChildContext() {
        return { document: toJS(this.store.document) };
    }


    // async fetch() {
    //     const { project, revision, document } = this.props.routeState.params;
    //     this.store.setDocument(null);
    //     try {
    //         await this.store.fetchDocument(project, revision, document);
    //     } catch ( e ) {
    //         app.notification.error({
    //             message  : e && e.message ? e.message : 'Document does not exist',
    //             placement: 'bottomRight',
    //         });
    //     }
    // }
    //
    // public componentDidMount(): void {
    //     log('componentDidMount');
    //     this.fetch();
    // }
    //
    // public componentDidUpdate(prevProps: Readonly<DocumentPageProps>, prevState: Readonly<{}>, snapshot?: any): void {
    //     // this.fetch();
    // }

    render() {
        const { children, routeState, ...props } = this.props;
        const { document }                       = this.store;

        ! document && log('render', 'NO DOCUMENT', { document: document, props });
        document && log('render', 'WITH DOCUMENT', document.key, { document: document, props });
        let content = null;
        if ( document ) {
            try {
                content = this.hc.parse(document.content);
            } catch ( e ) {
                console.warn(e);
            }
        }
        return <div  id="document">{content ? content : null}</div>
        // return (
        //     <div id="document" >
        //         <If condition={document}>
        //             <Helmet>
        //                 <title>{document.title || document.key}</title>
        //             </Helmet>
        //             {content}
        //         </If>
        //     </div>
        // );
    }
}

