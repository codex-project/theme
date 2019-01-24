import { Plugin, PluginFactory, State } from 'router5';

export interface TransitionPluginTarget {
    onTransition(transition: 'start' | 'cancel' | 'error' | 'success', toState?: State, fromState?: State, err?: any)
}

const log                            = require('debug')('routing:plugins:transition');
export const transitionPluginFactory = (target: TransitionPluginTarget): PluginFactory => {
    let transitionPlugin: PluginFactory = (router, dependencies): Plugin => {
        return {
            onTransitionStart  : (...args) => {
                log('onTransitionStart', args);
                target.onTransition('start', ...args);
            },
            onTransitionCancel : (...args) => {
                log('onTransitionCancel', args);
                target.onTransition('cancel', ...args);
            },
            onTransitionError  : (...args) => {
                log('onTransitionError', args);
                target.onTransition('error', ...args);
            },
            onTransitionSuccess: (...args) => {
                log('onTransitionSuccess', args);
                target.onTransition('success', ...args);
            },
        };
    };

    (transitionPlugin as any).pluginName = 'TRANSITION_PLUGIN';
    return transitionPlugin as PluginFactory;
};

