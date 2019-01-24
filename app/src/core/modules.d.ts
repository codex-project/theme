// noinspection ES6UnusedImports
import api from '@codex/api';
// noinspection ES6UnusedImports
import React from 'react';
// noinspection ES6UnusedImports
import router5, { State } from 'router5';

declare global {
    const BACKEND_DATA: api.Query;
}


declare module 'antd/es/menu' {
    interface MenuProps {
        overflowedIndicator?: React.ReactNode
        renderMenuItem?: any
    }
}

declare module 'antd/lib/menu' {
    interface MenuProps {
        overflowedIndicator?: React.ReactNode
        renderMenuItem?: any
    }
}

declare module 'antd/lib/drawer' {
    interface DrawerProps {
        duration?: string
        ease?: string
        onChange?: Function
        onMaskClick?: Function
        onHandleClick?: Function
    }
}

declare module '@codex/api/types/generated' {
    import { LocationDescriptorObject } from 'history';

    interface MenuItem {
        __raw?: any
        to?: LocationDescriptorObject<any> & { replace?: boolean }
        parent?: string
        custom?: Function
        renderer?: string
    }
}

declare module 'router5/types/types/base' {
    interface State {
        data?: { [ key: string ]: any }
    }
}

declare module 'router5/types/types/router' {
    import { RouteNodeProps } from 'react-router5/types/render/RouteNode';
    import { DictionaryWrapper } from 'collections/DictionaryWrapper';
    import { State } from 'router5';
    import { LinkData } from 'routing/routeMap';

    interface Dependencies {
        [ key: string ]: any

        data?: DictionaryWrapper
    }

    interface Route {
        /** if true then the defined Component in 'component' or 'loadComponent' will not be wrapped in a RouteNode */
        noWrap?: boolean
        /** The component to render */
        component?: React.ComponentType<RouteNodeProps & any>
        /** You can set a loader component that shows during state transitions with async data loaders (loadComponent, onActivate, ..) */
        loader?: React.ComponentType<any>
        /** Configure a transition animation for enter/leave */
        transition?: any

        /** Same as 'component' but with a dynamic import */
        loadComponent?(toState: State, fromState: State | null): Promise<any>

        /** Allows you to load async data and pass it to the component */
        onActivate?(toState: State, fromState: State | null): Promise<any>
        forward?(toState: State, fromState: State | null): Promise<any>

        onDeactivate?(fromState: State | null, toState: State): Promise<any>

        link?(params?:any,overrides?:any): LinkData
    }
}
