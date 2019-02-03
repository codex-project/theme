import { IConfig } from './interfaces';

export const config:IConfig = {
    debug: BACKEND_DATA.config.debug || false,
    cache: BACKEND_DATA.codex.cache.enabled || false,
    rootID: 'root',
    api: {
        url: '/api'
    }
}
