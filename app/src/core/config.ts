import { IConfig } from './interfaces';

export const config: IConfig = {
    debug : DEV ? true : BACKEND_DATA.config.debug || false,
    cache : DEV ? false : BACKEND_DATA.codex.cache.enabled || false,
    rootID: 'root',
    api   : {
        url: '/api',
    },
};
