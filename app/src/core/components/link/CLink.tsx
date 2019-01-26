import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { hot, WithRouterProps } from 'decorators';
import { CLinkStore, Store } from 'stores';
import { RouteMap } from 'router';
import { lazyInject } from 'ioc';

const log = require('debug')('components:CLink');


export interface CLinkProps {
    type: string
    action?: string
    to: string
    href?: string
}

@hot(module)
@observer
export class CLink extends React.Component<CLinkProps & WithRouterProps> {
    static displayName: string               = 'CLink';
    static defaultProps: Partial<CLinkProps> = {};
    static childContextTypes                 = { router: PropTypes.object };

    @lazyInject('store') store: Store;
    @lazyInject('store.links') links: CLinkStore;
    @lazyInject('routes') routes: RouteMap;

    getChildContext() { return { router: this.props }; }

    render() {
        let { type, action, to, children, href,staticContext,history,location, ...rest } = this.props;
        if ( href ) to = href;

        to = this.routes.toUrl(to)
        const matches = this.routes.matchPath(to);

        if ( matches.length === 0 ) {
            console.warn(`Link with to [${to}] does not match any route.`);
            return null;
        }
        const match = matches[ 0 ];

        if ( ! this.links.hasType(type) ) {
            console.warn(`Link type [${type}] not valid. Register it with Link.registerType()`);
            return null;
        }

        const TypeComponent = this.links.getType(type);

        if ( action ) {
            if ( ! this.links.hasAction(type, action) ) {
                console.warn(`Link action [${action}] for type [${type}] not valid. Register it with Link.registerAction()`);
                return null;
            }

            const ActionComponent = this.links.getAction(type, action);

            return (
                <ActionComponent to={to} match={match} {...rest}>
                    <TypeComponent to={to} match={match} {...rest}>{children}</TypeComponent>
                </ActionComponent>
            );
        }


        return (
            <TypeComponent to={to} match={match} {...rest} />
        );
    }
}


/*

project.modal
project.popover
project.tooltip

revision.modal
revision.popover
revision.tooltip

document.modal
document.popover
document.tooltip


 */
