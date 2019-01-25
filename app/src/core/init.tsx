import React from 'react';

import { configure } from 'mobx';
import { app } from 'ioc';
import { MenuPlugin } from 'menus';
import { RouterPlugin } from 'router';
import { App } from 'components/App';

const log = require('debug')('site:index');

configure({ enforceActions: 'never' });

app.Component = App;

app
    .plugin(new MenuPlugin())
    .plugin(new RouterPlugin({
        defaultRoute: 'documentation',
    }));

app.hooks.registered.tap('CORE', app => {
    if ( app.plugins.has('menu') ) {
        let menuPlugin = app.plugins.get<MenuPlugin>('menu');
        menuPlugin.hooks.register.tap('CORE', manager => {

        });
    }
});
