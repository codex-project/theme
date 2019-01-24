import React from 'react';
import { RouterState } from 'react-router5-hocs/modules/types';


export function handleRouteNode(node: React.Component<RouterState>) {
    const { route, previousRoute, router, ...props } = node.props;
    if ( ! route ) {
        return null;
    }
    if ( route.data.component ) {
        const Component = route.data.component;

        return <Component {...props} />;
    }
    return null;
}
