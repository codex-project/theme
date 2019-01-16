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
import { TOC, TOCHeader, TOCList, TOCListItem } from 'components/toc';
import { CookieStorage, LocalStorage, SessionStorage } from '@radic/util';
import { CLink } from 'components/link';
import { Trigger } from 'components/Trigger';
import { Link } from 'react-router-dom';
import { Col, Modal, Popover, Row, Tooltip } from 'antd';
import { Icon } from 'components/Icon';
import { Button } from 'components/toolbar/Button';
import { ApiLocalStorageCache } from 'classes/ApiLocalStorageCache';


export const containerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    decorate(injectable(), Api);

    bind<LocalStorage>('storage.local').to(LocalStorage).inSingletonScope();
    bind<SessionStorage>('storage.session').to(SessionStorage).inSingletonScope();
    bind<CookieStorage>('storage.cookie').to(CookieStorage).inSingletonScope();
    bind<Fetched>('fetched').to(Fetched).inSingletonScope();

    bind<Breakpoints>('breakpoints').to(Breakpoints).inSingletonScope();
    bind<CssVariables>('cssvars').to(CssVariables).inSingletonScope();

    bind<Routes>('routes').toConstantValue(routes);
    bind<Store>('store').to(Store).inSingletonScope();

    bind<LayoutStore>('store.layout').to(LayoutStore).inSingletonScope().onActivation((ctx, layout) => {
        layout.merge(toJS(ctx.container.get<Store>('store').codex.layout));
        return layout;
    });
    bind<HtmlComponents>('components').to(HtmlComponents).inSingletonScope().onActivation((ctx, components) => {
        components.registerMap({
            'c-code-highlight': CodeHighlight,
            'c-toc'           : TOC,
            'c-toc-list'      : TOCList,
            'c-toc-list-item' : TOCListItem,
            'c-toc-header'    : TOCHeader,
            'c-link'          : CLink,

            'link'   : Link,
            'trigger': Trigger,
            'modal'  : Modal,
            'icon'   : Icon as any,
            'col'    : Col,
            'row'    : Row,
            'button' : Button,
            'tooltip': Tooltip,
            'popover': Popover,
        });
        return components;
    });
    bind<Api>('api').to(Api).inSingletonScope().onActivation((ctx, api) => {
        const c = ctx.container.get<IConfig>('config');
        api.configure(c.api);
        if ( c.cache ) {
            const cache = new ApiLocalStorageCache();
            cache.apply(api);
        }
        return api;
    });
    bind<MenuManager>('menumanager').to(MenuManager).inSingletonScope();
});

