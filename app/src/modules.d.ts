

// noinspection ES6UnusedImports
import api from '@codex/api';
// noinspection ES6UnusedImports
import React from 'react';
// noinspection ES6UnusedImports
import * as H from 'history';


declare global {
    const BACKEND_DATA: api.Query;

    interface Window {
        // history:H.History
        $: ZeptoStatic;

    }

    interface History extends H.History {}

    interface ResizeObserverCallback {
        (entries: ResizeObserverEntry[], observer: ResizeObserver): void
    }

    interface ResizeObserverEntry {
        readonly target: Element;
        readonly contentRect: DOMRectReadOnly;
    }

    interface ResizeObserver {
        observe(target: Element): void;

        unobserve(target: Element): void;

        disconnect(): void;
    }

    class ResizeObserver {
        constructor(cb: ResizeObserverCallback)

        observe(target: Element): void;

        unobserve(target: Element): void;

        disconnect(): void;
    }

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

    interface MenuItem {
        __raw?: any
        to?: any
        parent?: string
        custom?: Function
        renderer?: string
    }
}
