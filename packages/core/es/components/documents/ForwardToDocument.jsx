var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Redirect } from 'react-router';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import React from 'react';
const log = require('debug')('components:forwardtodocument');
export class ForwardToDocument extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { params: null };
    }
    getRedirectParams() {
        let { location, history, staticContext, match, redirect, children } = this.props;
        let params = match.params || {};
        let projectKey = params.project || this.store.codex.default_project;
        if (!this.store.hasProject(projectKey)) {
            projectKey = this.store.codex.default_project;
            log(`Project [${projectKey}] not found`);
        }
        let project = this.store.getProject(projectKey);
        let revisionKey = params.revision || project.default_revision;
        if (!this.store.hasRevision(projectKey, params.revision)) {
            revisionKey = project.default_revision;
            log(`Revision [${revisionKey}] for project [${projectKey}] not found`);
        }
        let document = params.document || this.store.getRevision(projectKey, revisionKey).default_document;
        params = { project: project.key, revision: revisionKey, document };
        log('Forward getRedirectParams', { params });
        return params;
    }
    componentDidMount() {
        this.setState({ params: this.getRedirectParams() });
    }
    render() {
        if (!this.state.params)
            return null;
        let { location, history, staticContext, match, redirect, children } = this.props;
        let { project, revision, document } = this.state.params;
        let to = `/documentation/${project}/${revision}/${document}`;
        log('Forward render', { state: this.state, location: history.location });
        if (history.location.pathname === to)
            return null;
        return (<Redirect to={to} {...redirect || {}}/>);
    }
}
ForwardToDocument.displayName = 'ForwardToDocument';
ForwardToDocument.defaultProps = {
    redirect: {
        push: true,
        exact: true
    }
};
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], ForwardToDocument.prototype, "store", void 0);
