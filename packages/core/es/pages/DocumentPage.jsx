var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as React from 'react';
import { hot } from 'decorators';
import { Api } from '@codex/api';
import { lazyInject } from 'ioc';
import { Document } from 'components/documents';
import { Store } from 'stores';
import posed from 'react-pose';
const log = require('debug')('pages:home');
const Container = posed.div({
    enter: { staggerChildren: 50 }
});
const P = posed(Document)({
    enter: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 }
});
let DocumentPage = class DocumentPage extends React.Component {
    constructor() {
        super(...arguments);
        this.attributeHandler = (document) => {
            let attrs = document.attributes ? document.attributes : document.attributes;
        };
    }
    render() {
        // processAttributes={this.attributeHandler}/>
        const { project, revision, document } = this.props;
        // return <Document project={project} revision={revision} document={document} updateTitle />
        return (<Container>
                <Document project={project} revision={revision} document={document} updateTitle/>
            </Container>);
    }
};
DocumentPage.displayName = 'DocumentPage';
__decorate([
    lazyInject('api'),
    __metadata("design:type", Api)
], DocumentPage.prototype, "api", void 0);
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], DocumentPage.prototype, "store", void 0);
DocumentPage = __decorate([
    hot(module)
], DocumentPage);
export default DocumentPage;
