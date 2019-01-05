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
import React from 'react';
import { hot } from '../../decorators';
import { Card } from 'antd';
import { app, lazyInject } from '../../ioc';
import { renderLoading } from '../loading';
import PropTypes from 'prop-types';
import './index.scss';
import { Api } from '@codex/api';
import { observer } from 'mobx-react';
import { getPrism } from '../../utils/get-prism';
import { HtmlComponents } from '../../classes/HtmlComponents';
import { BrowserRouter } from 'react-router-dom';
import { Store } from '../../stores';
import Helmet from 'react-helmet';
import { toJS } from 'mobx';
const { Meta } = Card;
const log = require('debug')('components:document');
let Document = class Document extends React.Component {
    getChildContext() {
        return {
            router: app.get(BrowserRouter),
            document: toJS(this.store.document),
            attributes: toJS(this.store.document),
        };
    }
    componentDidMount() {
        this.load();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        let projectChanged = this.props.project !== prevProps.project;
        let revisionChanged = this.props.revision !== prevProps.revision;
        let documentChanged = this.props.document !== prevProps.document;
        if (prevProps && prevState && (projectChanged || revisionChanged || documentChanged)) {
            this.load();
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.fetchDocument(this.props.project, this.props.revision, this.props.document);
            yield getPrism();
        });
    }
    render() {
        if (!this.store.document || !this.store.document.content || this.store.fetching)
            return renderLoading();
        const content = this.hc.parse(this.store.document.content);
        if (this.props.updateTitle) {
            return (<div id="document">
                    <Helmet>
                        <title>{this.store.document.title || this.props.document}</title>
                    </Helmet>
                    {content}
                </div>);
        }
        return <div id="document">{content}</div>;
    }
};
Document.displayName = 'Document';
Document.defaultProps = {
    processAttributes: () => null,
    updateTitle: false,
};
Document.childContextTypes = {
    router: PropTypes.object.isRequired,
    document: PropTypes.object,
    attributes: PropTypes.object,
};
__decorate([
    lazyInject('api'),
    __metadata("design:type", Api)
], Document.prototype, "api", void 0);
__decorate([
    lazyInject('components'),
    __metadata("design:type", HtmlComponents)
], Document.prototype, "hc", void 0);
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], Document.prototype, "store", void 0);
Document = __decorate([
    hot(module),
    observer
], Document);
export { Document };
