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
import PropTypes from 'prop-types';
import { hot, WithRouter } from 'decorators';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { Routes } from 'collections/Routes';
import { app, lazyInject } from 'ioc';
import { Helmet } from 'react-helmet';
import { ErrorBoundary } from 'components/errors/ErrorBoundary';
import { RouterPages } from 'components/router-pages/RouterPages';
import 'styling/stylesheet.scss';
import 'styling/semantic.less';
import './App.mscss';
import { Layout } from 'components/layout';
const log = require('debug')('app');
let App = class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (!app.isBound(BrowserRouter)) {
            app.bind(BrowserRouter, 'router').toConstantValue(context.router);
        }
        if (!app.isBound('history')) {
            app.bind('history').toConstantValue(props.history);
        }
    }
    render() {
        return (<ErrorBoundary>
                <Layout>
                    <Helmet defaultTitle={this.store.codex.display_name} titleTemplate={this.store.codex.display_name + ' - %s'}/>
                    <ErrorBoundary>
                        <RouterPages routes={this.routes}/>
                    </ErrorBoundary>
                </Layout>
            </ErrorBoundary>);
    }
    render2() {
        // let routes = app.get<Routes>('routes')
        return (<Layout>
                <Helmet defaultTitle={this.store.codex.display_name} titleTemplate={this.store.codex.display_name + ' - %s'}/>
                <ErrorBoundary>
                    
                </ErrorBoundary>

                <Layout>

                    <ErrorBoundary>
                        
                    </ErrorBoundary>

                    <ErrorBoundary>
                        
                        <ErrorBoundary>
                            <RouterPages routes={this.routes}/>
                        </ErrorBoundary>
                        
                    </ErrorBoundary>

                </Layout>

                <ErrorBoundary>
                    
                </ErrorBoundary>
            </Layout>);
    }
};
App.displayName = 'App';
App.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.shape({
            push: PropTypes.func.isRequired,
            replace: PropTypes.func.isRequired,
            createHref: PropTypes.func.isRequired,
        }).isRequired,
    }).isRequired,
};
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], App.prototype, "store", void 0);
__decorate([
    lazyInject('routes'),
    __metadata("design:type", Routes)
], App.prototype, "routes", void 0);
App = __decorate([
    hot(module),
    WithRouter(),
    observer,
    __metadata("design:paramtypes", [Object, Object])
], App);
export { App };
