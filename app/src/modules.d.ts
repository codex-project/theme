// noinspection ES6UnusedImports
import api from '@codex/api';
// noinspection ES6UnusedImports
import React from 'react';

// noinspection ES6UnusedImports
import * as H from 'history'


declare global {
    const BACKEND_DATA: api.Query;

    interface Window{
        history:H.History
    }
    interface History extends H.History {}
}

interface Window{
    history:H.History
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
