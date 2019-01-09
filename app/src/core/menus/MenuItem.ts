import { api } from '@codex/api';
import { LocationDescriptorObject } from 'history';

export interface MenuItem extends api.MenuItem {

    to?: LocationDescriptorObject<any> & { replace?: boolean }
    parent?: string
    custom?: Function
}
