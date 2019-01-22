import {app,lazyInject} from './ioc';
import { configure } from 'mobx';
import { containerModule } from './container-module';
import { getRandomId } from './utils/general';
import { ColorElement } from './elements/ColorElement';
import * as menuTypes from './menus/types';
import { configureRouter } from './routing';
import { Router } from 'router5';


const log = require('debug')('index');

//mobx
configure({ enforceActions: 'never' });


const router = configureRouter();

app.bind('router').toConstantValue(router);

// Rx.Observable.from(router);

app.load(containerModule);

app.use(app => {
    app.hooks.registered.tap('CORE', (app) => {


        app.menus.hooks.defaults.tap('CORE', (item, parent?) => {
            if ( item.id === undefined ) {
                item.id = getRandomId(20);
            }
            if ( item.type === undefined ) {
                if ( item.children ) {
                    item.type = 'sub-menu';
                } else if ( item.href ) {
                    item.type = 'link';
                }
            }
            if ( parent ) {
                item.parent = parent.id;
            }
            if ( item.selected === undefined ) {
                item.selected = false;
            }
            if ( item.expand === undefined ) {
                item.expand = false;
            }
            return item;
        });

        Object.keys(menuTypes).forEach(key => app.menus.registerType(menuTypes[ key ]));
    });
    app.hooks.boot.tap('CORE', (app) => {
        app.menus.types.forEach(type => {
            type.boot();
        })
    })
    app.hooks.booted.tap('CORE', app => {
        app.get<Router>('router').start();
    })
});

customElements.define(ColorElement.TAG, ColorElement);
