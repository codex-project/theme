import { strEnsureLeft, strEnsureRight, strStripLeft } from '../utils/general';

    const make                 = (prefix: string, path: string) => strEnsureLeft(strEnsureRight(prefix, '/'), '/') + strStripLeft(path, '/');
    export const root          = (path: string = '') => make(BACKEND_DATA.codex.urls.root, path);
    export const api           = (path: string = '') => make(BACKEND_DATA.codex.urls.api, path);
    export const documentation = (path: string = '') => make(BACKEND_DATA.codex.urls.documentation, path);
