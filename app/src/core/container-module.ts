import { ContainerModule, decorate, injectable } from 'inversify';
import { routes } from './routes';
import { Store } from './stores';
import { Api } from '@codex/api';
import { IConfig } from './interfaces';
import { HtmlComponents } from './classes/HtmlComponents';
import { MenuManager } from './menus/MenuManager';
import { Routes } from './collections/Routes';
import { LayoutStore } from './stores/store.layout';
import { toJS } from 'mobx';
import { Fetched } from 'stores/Fetched';
import { CssVariables } from 'classes/CssVariables';
import { Breakpoints } from 'utils/breakpoints';
import { CodeHighlight } from 'components/code-highlight';
import { TOCHeader, TOCList, TOCListItem } from 'components/toc';


export const containerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    decorate(injectable(), Api);

    bind<Breakpoints>('breakpoints').to(Breakpoints).inSingletonScope();
    bind<CssVariables>('cssvars').to(CssVariables).inSingletonScope();
    bind<Fetched>('fetched').to(Fetched).inSingletonScope();
    bind<Routes>('routes').toConstantValue(routes);
    bind<Store>('store').to(Store).inSingletonScope();
    bind<LayoutStore>('store.layout').to(LayoutStore).inSingletonScope().onActivation((ctx, layout) => {
        layout.merge(toJS(ctx.container.get<Store>('store').codex.layout));
        return layout;
    });
    bind<HtmlComponents>('components').to(HtmlComponents).inSingletonScope().onActivation((ctx, components) => {
        components.registerMap({
            // 'c-code-highlight': CodeHighlight,
            // 'c-toc-list'      : TOCList,
            // 'c-toc-list-item' : TOCListItem,
            // 'c-toc-header'    : TOCHeader,
        });
        return components;
    });
    bind<Api>('api').to(Api).inSingletonScope().onActivation((ctx, api) => {
        const c = ctx.container.get<IConfig>('config');
        return api.configure(c.api);
    });
    bind<MenuManager>('menumanager').to(MenuManager).inSingletonScope();
});

