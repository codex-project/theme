import api = require('@codex/api'); //{ api } from '@codex/api';
import H = require('history');

declare global {

    const BACKEND_DATA: api.Query;
}


declare module '@codex/api/types/types' {

    interface MenuItem {
        to?: H.LocationDescriptorObject<any> & {replace?:boolean}
        parent?: string
        custom?: Function
    }
}
