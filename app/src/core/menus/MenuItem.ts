import { api } from '@codex/api';
import { LocationDescriptorObject } from 'history';

export interface MenuItem extends api.MenuItem {
    __raw?:any
    to?: LocationDescriptorObject<any> & { replace?: boolean }
    parent?: string
    custom?: Function
    renderer?: string
}
