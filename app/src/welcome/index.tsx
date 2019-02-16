import { Application, BasePlugin, RouterPlugin } from '@codex/core';
import React from 'react';

const log = require('debug')('welcome:index');


export class WelcomePlugin extends BasePlugin {
    public install(app: Application) {

        if ( app.plugins.has('router') ) {
            app.plugins.get<RouterPlugin>('router').hooks.register.tap(this.name, (routeMap) => {
                routeMap.set('home', {
                    name  : 'home',
                    path  : '/',
                    exact : true,
                    action: async (props, routeState) => {
                        const WelcomeView = (await import(/* webpackChunkName: "welcome.view" */'./views/WelcomeView')).WelcomeView;
                        return <WelcomeView {...props} routeState={routeState}/>;
                    },
                });
            });
        }
    }

    public register(bind, unbind, isBound, rebind): Promise<any> {
        return undefined;
    }

}

export default WelcomePlugin;
