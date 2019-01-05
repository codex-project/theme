var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { action, observable, runInAction, toJS } from 'mobx';
import { get, has, set, snakeCase } from 'lodash';
import { injectable, postConstruct } from 'inversify';
import { LayoutStore } from './store.layout';
import { lazyInject } from '../ioc';
import { Api, api } from '@codex/api';
const log = require('debug')('store');
let Store = class Store {
    constructor() {
        // public readonly document: DocumentStore;
        this.codex = Object.assign({}, BACKEND_DATA.codex);
        this.config = Object.assign({}, BACKEND_DATA.config);
        this.breadcumbs = {
            items: [],
            set(items) { this.items = items; },
            add(...items) { this.items.push(...items); },
            pop() { this.items.pop(); },
            clear() { this.set([]); },
        };
        this.fetching = false;
        this.project = null;
        this.revision = null;
        this.document = null;
        this.fetched = {};
        log('constructor', this);
        console.groupCollapsed('store constructor');
        console.trace('store constructor', this);
        console.groupEnd();
        // this.layout = new LayoutStore(this);
        log('constructored', this);
        // this.document = new DocumentStore(this);
    }
    postConstruct() {
        log('postConstruct', this);
        // this.layout.merge(toJS(this.codex.layout));
        log('postConstructed', this);
    }
    toJS() {
        const { codex, config, fetching, project, revision, document, layout } = this;
        return toJS({ codex, config, fetching, project, revision, document, layout: layout.toJS() });
    }
    hasProject(key) { return !!this.getProject(key); }
    getProject(key) { return this.codex.projects.find(p => p.key === key); }
    hasRevision(projectKey, revisionKey) { return !!this.getRevision(projectKey, revisionKey); }
    getRevision(projectKey, revisionKey) {
        if (!this.hasProject(projectKey))
            return undefined;
        return this.getProject(projectKey).revisions.find(r => r.key === revisionKey);
    }
    set(prop, value) { set(this, prop, value); }
    has(prop) { return has(this, prop); }
    mergeLayout(mergable) {
        if (mergable.layout) {
            this.layout.merge(mergable.layout);
        }
    }
    setDocument(document) {
        this.document = document;
        this.mergeLayout(document);
        if (document) {
            // this.key     = document.key;
            // this.content = document.content;
        }
    }
    setProject(project) {
        this.project = project;
        this.mergeLayout(project);
    }
    setRevision(revision) {
        this.revision = revision;
        this.mergeLayout(revision);
    }
    fetchDocument(project, revision, document) {
        return __awaiter(this, void 0, void 0, function* () {
            runInAction(() => {
                this.fetching = true;
                // this.content  = null;
            });
            yield this.fetch(project, revision, document);
            runInAction(() => {
                this.fetching = false;
            });
        });
    }
    fetch(projectKey, revisionKey, documentKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = [];
            let projectPath = `projects.${snakeCase(projectKey)}`;
            let revisionPath = `revisions.${snakeCase(projectKey)}.${snakeCase(revisionKey)}`;
            let documentPath = `documents.${snakeCase(projectKey)}.${snakeCase(revisionKey)}.${snakeCase(documentKey)}`;
            let hasProject = has(this.fetched, projectPath);
            let hasRevision = has(this.fetched, revisionPath);
            let hasDocument = has(this.fetched, documentPath);
            if (!hasProject) {
                query.push(`
project(key: $projectKey){
    key
    display_name
    description
    changes
}`);
            }
            if (!hasRevision) {
                query.push(`
revision(projectKey: $projectKey, revisionKey: $revisionKey){
    key
    changes
}`);
            }
            if (!hasDocument) {
                query.push(`
document(projectKey: $projectKey, revisionKey: $revisionKey, documentKey: $documentKey){
    key
    changes
    content
}`);
            }
            if (query.length > 0) {
                let result = yield this.api.query(`
query Fetch($projectKey: ID!, $revisionKey: ID!, $documentKey: ID!) {
    ${query.join('\n')}
}        
        `, { projectKey, revisionKey, documentKey });
                if (!hasProject) {
                    set(this.fetched, projectPath, result.project.changes);
                    set(this.fetched, projectPath + '.key', result.project.key);
                    set(this.fetched, projectPath + '.display_name', result.project.display_name);
                    set(this.fetched, projectPath + '.description', result.project.description);
                }
                if (!hasRevision) {
                    set(this.fetched, revisionPath, result.revision.changes);
                    set(this.fetched, revisionPath + '.key', result.revision.key);
                }
                if (!hasDocument) {
                    set(this.fetched, documentPath, result.document.changes);
                    set(this.fetched, documentPath + '.key', result.document.key);
                    set(this.fetched, documentPath + '.content', result.document.content);
                }
            }
            runInAction(() => {
                if (!this.project || this.project.key !== projectKey) {
                    this.setProject(get(this.fetched, projectPath));
                    this.revision = null;
                    this.document = null;
                }
                if (!this.revision || this.revision.key !== revisionKey) {
                    this.setRevision(get(this.fetched, revisionPath));
                    this.document = null;
                }
                if (!this.document || this.document.key !== documentKey) {
                    this.setDocument(get(this.fetched, documentPath));
                }
            });
        });
    }
};
__decorate([
    lazyInject('api'),
    __metadata("design:type", Api)
], Store.prototype, "api", void 0);
__decorate([
    lazyInject('store.layout'),
    __metadata("design:type", LayoutStore)
], Store.prototype, "layout", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], Store.prototype, "codex", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], Store.prototype, "config", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], Store.prototype, "breadcumbs", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Store.prototype, "postConstruct", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], Store.prototype, "set", null);
__decorate([
    observable,
    __metadata("design:type", Boolean)
], Store.prototype, "fetching", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], Store.prototype, "project", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], Store.prototype, "revision", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], Store.prototype, "document", void 0);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Store.prototype, "mergeLayout", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Store.prototype, "setDocument", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Store.prototype, "setProject", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Store.prototype, "setRevision", null);
Store = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], Store);
export { Store };
