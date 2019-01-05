import hoistNonReactStatics from 'hoist-non-react-statics';
import { withRouter } from 'react-router';
const log = require('debug')('decorators');
export function hot(module, hoist = false) {
    return (TargetComponent) => {
        if (DEV) {
            let decorator = require('react-hot-loader').hot(module);
            if (!hoist) {
                return decorator(TargetComponent);
            }
            return hoistNonReactStatics(TargetComponent, decorator(TargetComponent));
        }
        return TargetComponent;
    };
}
export const WithRouter = () => {
    return (target) => {
        return withRouter(target);
    };
};
export function es5ClassFix() {
    return (target) => {
        return class extends target {
            constructor(...args) {
                super(...args);
                Object.setPrototypeOf(this, target.prototype);
            }
        };
    };
}
