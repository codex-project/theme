import { RouteDefinition, RouteState } from 'router';
import { RouteComponentProps } from 'react-router';


const makeRouteState = (props: RouteComponentProps, definition: RouteDefinition): RouteState => {
    const { name, action, render, component, location, children, ...routeDefinition } = definition;
    return {
        name : name,
        route: { ...routeDefinition },
        ...props.location,
        ...props.match,
    };
};

export class Resolver {
    resolved = {};
    resolving = {}

    async resolve(props: RouteComponentProps, definition: RouteDefinition) {

        const make = async() => {
            if ( definition.loadComponent && ! definition.component ) {
                let val              = await definition.loadComponent();
                let Component        = val.default ? val.default : val;
                definition.component = Component;
            }

            if ( definition.action ) {
                let state  = makeRouteState(props, definition);
                let result = await definition.action({ ...props, routeState: state }, state, definition.component);
            }
        }

        this.resolving[definition.name];
    }
}
