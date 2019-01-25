import { PluginFactory } from 'router5';

const noop = () => {};

const log = require('debug')('routing:plugins').extend('logger');

export const loggerPluginFactory = (): PluginFactory => () => {
    let startGroup, endGroup;

    if ( console.groupCollapsed ) {
        startGroup = label => console.groupCollapsed(label);
        endGroup   = () => console.groupEnd();
    } else if ( console.group ) {
        startGroup = label => console.group(label);
        endGroup   = () => console.groupEnd();
    } else {
        startGroup = noop;
        endGroup   = noop;
    }

    log('Router started');

    return {
        onStop() {
            log('Router stopped');
        },
        onTransitionStart(toState, fromState) {
            endGroup();
            toState   = toState || { name: 'null' } as any;
            fromState = fromState || { name: 'null' } as any;
            startGroup(`Router transition :: to(${toState.name || toState.path}) :: from(${fromState.name || fromState.path})`);
            log('Transition started from state', fromState);
            log('To state', toState);
        },
        onTransitionCancel() {
            console.warn('Transition cancelled');
        },
        onTransitionError(toState, fromState, err) {
            console.warn('Transition error with code ' + err.code);
            endGroup();
        },
        onTransitionSuccess() {
            log('Transition success');
            endGroup();
        },
    };
};
