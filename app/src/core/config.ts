import { IConfig } from './interfaces';
import { LocalStorage } from 'utils/storage';



export const config: IConfig = {
    debug : LocalStorage.has('codex.config.debug') ? LocalStorage.get.item('codex.config.debug') : DEV ? true : BACKEND_DATA.config.debug || false,
    cache : LocalStorage.has('codex.config.cache') ? LocalStorage.get.item('codex.config.cache') : DEV ? false : BACKEND_DATA.codex.cache.enabled || false,
    rootID: 'root',
    api   : {
        url: '/api',
    },
};
