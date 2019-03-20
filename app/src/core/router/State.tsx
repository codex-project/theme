import { Route, RouteComponent } from 'router';


export class State {
    name: string;
    route: Route;
    render: (state: this) => RouteComponent;
    params: any = {};
    url: string;
    meta: any   = {};
}
