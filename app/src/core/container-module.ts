import { ContainerModule } from 'inversify';
import { CookieStorage, LocalStorage, SessionStorage } from './utils/storage';
import { Breakpoints } from './utils/breakpoints';
import { CssVariables } from './classes/CssVariables';
import { HtmlComponents } from './classes/HtmlComponents';
import { ApiLocalStorageCache } from 'classes/ApiLocalStorageCache';
import { IConfig } from 'interfaces';
import { Api } from '@codex/api';
import { Fetched, LayoutStore, Store } from 'stores';
import { decorate, injectable } from 'ioc';
import { toJS } from 'mobx';

export const containerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    decorate(injectable(), Api);
    bind<Fetched>('fetched').to(Fetched).inSingletonScope();
    bind<Store>('store').to(Store).inSingletonScope();
    bind<LayoutStore>('store.layout').to(LayoutStore).inSingletonScope().onActivation((ctx, layout) => {
        layout.merge(toJS(ctx.container.get<Store>('store').codex.layout));
        return layout;
    });

    bind<typeof LocalStorage>('storage.local').toConstantValue(LocalStorage);
    bind<typeof SessionStorage>('storage.session').toConstantValue(SessionStorage);
    bind<typeof CookieStorage>('storage.cookie').toConstantValue(CookieStorage);
    bind<Breakpoints>('breakpoints').to(Breakpoints).inSingletonScope();
    bind<CssVariables>('cssvars').to(CssVariables).inSingletonScope();
    bind<HtmlComponents>('components').to(HtmlComponents).inSingletonScope();
    bind<Api>('api').to(Api).inSingletonScope().onActivation((ctx, api) => {
        const c = ctx.container.get<IConfig>('config');
        api.configure(c.api);
        if ( c.cache ) {
            const cache = new ApiLocalStorageCache();
            cache.apply(api);
        }
        return api;
    });
});

