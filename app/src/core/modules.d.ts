import api = require('@codex/api'); //{ api } from '@codex/api';
import H = require('history');
import React = require('react');


declare global {

    const BACKEND_DATA: api.Query;
}


declare module '@codex/api/types/types' {
    interface MenuItem {
        to?: H.LocationDescriptorObject<any> & { replace?: boolean }
        parent?: string
        custom?: Function
    }
}
declare module 'antd/es/menu' {
    interface MenuProps {
        overflowedIndicator?: React.ReactNode
        renderMenuItem?:any
    }
}

declare module 'antd/lib/menu' {
    interface MenuProps {
        overflowedIndicator?: React.ReactNode
        renderMenuItem?:any
    }
}