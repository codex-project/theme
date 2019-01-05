import 'reflect-metadata';
import './utils/zepto';
import {app,lazyInject} from './ioc';
import { configure } from 'mobx';
import { containerModule } from './container-module';
import { getRandomId } from './utils/general';
import { ColorElement } from './elements/ColorElement';
import * as menuTypes from './menus/types';


const log = require('debug')('index');

//mobx
configure({ enforceActions: 'never' });

app.use(app => {
    app.load(containerModule);
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
});

customElements.define(ColorElement.TAG, ColorElement);
