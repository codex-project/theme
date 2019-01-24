import { Route } from 'router5';

export function findRoute(name, routes: Route[]) {
    let segments = name.split('.');
    let segment  = segments.shift();
    let current;
    let left     = routes;
    while ( left.length ) {
        current = left[ 0 ];
        left    = left.slice(1);
        if ( current.name === segment ) {
            if ( segments.length && current.children ) {
                segment = segments.shift();
                left    = current.children;
                continue;
            }
            if ( segments.length === 0 ) {
                return current;
            }
        }
    }
}

