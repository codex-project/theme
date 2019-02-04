import { Application, BasePlugin, Bind, IsBound, Rebind, RouterPlugin, Unbind } from '@codex/core';
import React from 'react';
import AuthPage from './AuthPage';


export default class AuthPlugin extends BasePlugin {
    name = 'auth';

    public install(app: Application) {

        if ( app.plugins.has('router') ) {
            app.plugins.get<RouterPlugin>('router').hooks.register.tap(this.name, (routeMap) => {
                // routeMap.set('auth.login', {
                //     name: 'auth.login',
                //     path: app.url.auth_login().replace('__service__', ':service'),
                //     component: AuthPage
                // });
                // routeMap.set('auth.logout', {
                //     name: 'auth.logout',
                //     path: app.url.auth_logout().replace('__service__', ':service'),
                //     component: AuthPage
                // });
                // routeMap.set('auth.login.callback', {
                //     name: 'auth.login.callback',
                //     path: app.url.auth_login_callback().replace('__service__', ':service'),
                //     component: AuthPage
                // });
            });
        }
    }

    public register(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any> {
        return undefined;
    }

}
