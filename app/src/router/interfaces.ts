import * as H from 'history'
import { State } from './Transition';

export interface Location extends H.Location {

}

export type To = string | { name: string, params?: any } | Location


export interface Lifecycle {
    canEnter?: (state: State) => Promise<any>
    beforeEnter?: (state: State) => Promise<any>
    enter?: (state: State) => Promise<any>
    canLeave?: (state: State) => Promise<any>
    beforeLeave?: (state: State) => Promise<any>
}

export interface Route extends Lifecycle {
    name: string
    path?: string
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean


    redirect?: any
    component?: any
    loadComponent?:()=>Promise<any>
}
