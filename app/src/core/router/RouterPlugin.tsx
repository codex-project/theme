import { Router } from './Router';
import { SyncHook } from 'tapable';
import { BrowserHistoryBuildOptions } from 'history/createBrowserHistory';
import { LocationDescriptorObject } from 'history';
import { Application } from '../classes/Application';
import { BasePlugin, Bind, IsBound, Rebind, Unbind } from '../classes/Plugin';
import { merge } from 'lodash';


export interface RouterPluginOptions {
    historyOptions?: BrowserHistoryBuildOptions
    defaultRoute: string | LocationDescriptorObject
}

export class RouterPlugin extends BasePlugin<Partial<RouterPluginOptions>> {
    name = 'router';
    hooks: {
        register: SyncHook<Router>
        registered: SyncHook<Router>


    }    = {
        register  : new SyncHook([ 'router' ]),
        registered: new SyncHook([ 'router' ]),
    };

    constructor(protected options: RouterPluginOptions = {} as any) {
        super(options);

        this.options = merge({}, {
            historyOptions: {},
        }, options);
    }

    async register(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): Promise<any> {
        bind('router').to(Router).inSingletonScope();
    }

    install(app: Application) {
        const stopProgress  = (timeout: number = 0) => {
            setTimeout(t => {
                if ( ! app.progress.isStarted() ) {
                    return;
                }
                app.progress.done();
            }, timeout);
        };
        const startProgress = () => {
            if ( app.progress.isStarted() ) {
                return;
            }
            app.progress.start();
            stopProgress(1500);
        };
        app.hooks.register.tap(this.name, (app) => {
            let { historyOptions, defaultRoute, ...routerOptions } = this.options;
            this.hooks.register.call(app.get('router'));
            app.bind('history').toDynamicValue((ctx) => ctx.container.get<Router>('router').history);
        });
        app.hooks.registered.tap(this.name, app => {
            this.hooks.registered.call(app.get('router'));
        });
        app.hooks.booted.tap(this.name, app => {
            const router = app.get<Router>('router');
            router.start(this.options.defaultRoute);
            router.hooks.transition.tap(this.name, transition => {
                transition.hooks.enter.tap(this.name, e => startProgress());
                transition.hooks.started.tap(this.name, e => startProgress());
                transition.hooks.canceled.tap(this.name, e => stopProgress(500));
                transition.hooks.finished.tap(this.name, e => stopProgress(500));
            });
            app.progress.start();
            stopProgress(1500);
        });
    }
}
