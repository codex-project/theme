import * as React from 'react';
import { hot } from '../decorators';
import { Api } from '@codex/api';
import { lazyInject } from '../ioc';
import { Document } from '../components/documents';
import { Store } from '../stores';
import posed from 'react-pose';

const log = require('debug')('pages:home');

export interface DocumentPageProps {
    project: string
    revision: string
    document: string
}


const Container = posed.div({
    enter: { staggerChildren: 50 }
});

const P = posed(Document)({
    enter: { x: 0, opacity: 1 },
    exit : { x: 50, opacity: 0 }
});

@hot(module)
export default class DocumentPage extends React.Component<DocumentPageProps> {
    @lazyInject('api') api: Api;
    @lazyInject('store') store: Store;

    static displayName = 'DocumentPage'

    attributeHandler = (document) => {
        let attrs = document.attributes ? document.attributes : document.attributes;

    }

    render() {
        // processAttributes={this.attributeHandler}/>
        const { project,revision,document } = this.props
        // return <Document project={project} revision={revision} document={document} updateTitle />
        return (
            <Container>
                <Document project={project} revision={revision} document={document} updateTitle />
            </Container>
        );
    }
}
