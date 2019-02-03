import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { RouteComponentProps, withRouter } from 'react-router';

const log = require('debug')('decorators');


export function hot<T>(module: NodeModule, hoist = false) {
    return (TargetComponent) => {
        return TargetComponent;
        if ( DEV ) {
            let decorator = require('react-hot-loader').hot(module);
            if ( ! hoist ) {
                return decorator(TargetComponent);
            }
            return hoistNonReactStatics(TargetComponent, decorator(TargetComponent));
        }
        return TargetComponent;
    };
}

export function cold<T>(module: NodeModule, hoist = false) {
    return (TargetComponent) => {
        if ( DEV ) {
            let {cold} = require('react-hot-loader')
            if ( ! hoist ) {
                return cold(TargetComponent);
            }
            return hoistNonReactStatics(TargetComponent, cold(TargetComponent));
        }
        return TargetComponent;
    };
}

export const WithRouter = () => {
    return (target) => {
        return withRouter(target) as any;
    };
};
export type WithRouterProps = Partial<RouteComponentProps<any>>


interface Constructor<T> {
    new(...args: any[]): T;
}

export function es5ClassFix(): (target: Constructor<any>) => any {
    return (target: Constructor<any>) => {
        return class extends target {
            constructor(...args: any[]) {
                super(...args);
                Object.setPrototypeOf(this, target.prototype);
            }
        };
    };
}
