import React, { ComponentType } from 'react';
import { injectable } from 'inversify';
import { LinkType } from 'components/link';
import { app } from 'ioc';

export type CLinkStoreTypes = Record<string, ComponentType<any>>

export interface CLinkStoreAction {
    type: string
    action: string
    component: ComponentType<any>
}

@injectable()
export class CLinkStore {
    types: CLinkStoreTypes = {};

    registerType(type: string, component) { this.types[ type ] = component; }

    hasType(name: string) {return ! ! this.getType(name);}

    getType(name: string) {return this.types[ name ];}


    actions: CLinkStoreAction[] = [];

    registerAction(type: string, action: string, component) { this.actions.push({ type, action, component }); }

    hasAction(type: string, action: string) { return ! ! this.actions.find(_action => _action.type === type && _action.action === action); }

    getAction(type: string, action: string) { return this.actions.find(_action => _action.type === type && _action.action === action).component; }
}
app.bind('store.links').to(CLinkStore).inSingletonScope()

export namespace clink {
    export function type(name: string) {
        return (Target) => {
            app.get<CLinkStore>('store.links').registerType(name, Target);
            return Target;
        };
    }

    export function action(typeName: string, actionName: string) {
        return (Target) => {
            app.get<CLinkStore>('store.links').registerAction(typeName, actionName, Target);
            return Target;
        };
    }
}
