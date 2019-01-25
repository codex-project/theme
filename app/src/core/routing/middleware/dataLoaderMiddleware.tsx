import { Router, State, transitionPath } from 'router5';
import { RouterStore } from 'routing/RouterStore';
import React from 'react';

const log = require('debug')('routing:middleware:activate');

declare module 'router5/types/types/base' {
    interface State {
        data?: { [ key: string ]: any }
    }
}


declare module 'router5/types/types/router' {
    interface Route {
        /** Allows you to load async data and pass it to the component */
        loadData?: (toState: State, fromState: State | null) => Promise<any>
        mapDataToProps?: (data: { [ key: string ]: any }, props: { [ key: string ]: any }) => void
    }
}

export const dataLoaderMiddlewareFactory = (store: RouterStore) => (router: Router) => (toState, fromState) => {
    const { toActivate }     = transitionPath(toState, fromState);
    const onActivateHandlers = toActivate
        .map(segment => {
            let route = store.routes.get(segment);
            return route && route.loadData;
        })
        .filter(Boolean);

    return Promise
        .all(onActivateHandlers.map(async callback => {
            return await callback(toState, fromState);
        }))
        .then(values => {
            let data = values.reduce((accData, rData) => Object.assign(accData, rData), {});
            log('dataLoaderMiddlewareFactory', 'onActivateHandlers', 'done', data);

            return { ...toState, data };
        });
};
