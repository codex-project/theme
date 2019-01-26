import React from 'react';

import { configure } from 'mobx';
import { app } from 'ioc';
import { MenuPlugin } from 'menus';
import { RouterPlugin } from 'router';
import Root from 'components/Root';

const log = require('debug')('site:index');

configure({ enforceActions: 'never' });

app.Component = Root;

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
