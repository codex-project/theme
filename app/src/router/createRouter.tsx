import { Router } from './Router';
import HomePage from './pages/HomePage';
import ThirdPage from './pages/ThirdPage';

export function createRouter() {
    let r = new Router();
    r
        .addRoute({
            name       : 'home',
            path       : '/',
            component  : HomePage,
            beforeLeave: async () => Promise.promisify(callback => setTimeout(() => callback(console.log('beforeLeave')), 500)),
        })
        .addRoute({
            name         : 'first',
            path         : '/first/:id',
            loadComponent: () => import('./pages/FirstPage'),
            beforeEnter  : async () => {
                console.log('beforeEnter1');
                return Promise.promisify(callback => {
                    console.log('beforeEnter');
                    setTimeout(() => callback(null), 3000);
                })();
            },
            enter        : async () => Promise.promisify(callback => setTimeout(() => callback(console.log('enter')), 500)),
        })
        .addRoute({
            name         : 'second',
            path         : '/second/:id',
            loadComponent: () => import('./pages/SecondPage'),
            beforeEnter  : async () => {
                console.log('beforeEnter1');
                return Promise.promisify(callback => {
                    console.log('beforeEnter');
                    setTimeout(() => callback(null), 3000);
                })();
            },
            enter        : async () => Promise.promisify(callback => setTimeout(() => callback(console.log('enter')), 500)),
        })
        .addRoute({
            name       : 'third',
            path       : '/third/:id',
            component  : ThirdPage,
            beforeEnter: async () => {
                console.log('beforeEnter1');
                return Promise.promisify(callback => {
                    console.log('beforeEnter');
                    setTimeout(() => callback(null), 3000);
                })();
            },
            enter      : async () => Promise.promisify(callback => setTimeout(() => callback(console.log('enter')), 500)),
        });


    // r.hooks.start.tap('a', (...args) => {
    //     console.log('router.hook.start', ...args);
    // });
    // r.hooks.stop.tap('a', (...args) => {
    //     console.log('router.hook.stop', ...args);
    // });
    // r.hooks.transition.tap('a', (transition) => {
    //     console.log('router.hook.transition');//, transition)
    //
    //     transition.hooks.leave.tap('a', (...args) => {
    //         console.log('router.hook.transition.hook.leave', ...args);
    //     });
    //     transition.hooks.enter.tap('a', (...args) => {
    //         console.log('router.hook.transition.hook.enter', ...args);
    //         transition.cancel();
    //     });
    //     transition.hooks.start.tap('a', (...args) => {
    //         console.log('router.hook.transition.hook.start', ...args);
    //     });
    //     transition.hooks.finished.tap('a', (...args) => {
    //         console.log('router.hook.transition.hook.finished', ...args);
    //     });
    //     transition.hooks.canceled.tap('a', (...args) => {
    //         console.log('router.hook.transition.hook.canceled', ...args);
    //     });
    // });

    return r;
}
