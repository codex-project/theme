import c from 'codex_core'
import { IWelcomeConfig } from './index';

declare module 'codex_core/interfaces' {

    interface IConfig {
        welcome: IWelcomeConfig
    }
}
