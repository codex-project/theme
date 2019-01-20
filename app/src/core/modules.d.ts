import api = require('@codex/api'); //{ api } from '@codex/api';
import React = require('react');

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
        duration?:string
        ease?:string
        onChange?:Function
        onMaskClick?:Function
        onHandleClick?:Function
    }
}
// noinspection ES6UnusedImports
import api from '@codex/api';
import { LocationDescriptorObject } from 'history';

declare module '@codex/api/types/generated' {

    interface MenuItem {
        __raw?: any
        to?: LocationDescriptorObject<any> & { replace?: boolean }
        parent?: string
        custom?: Function
        renderer?: string
    }
}
