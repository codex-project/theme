import { ContainerModule, decorate, injectable } from 'inversify';
import { Store } from 'stores';
import { Api } from '@codex/api';
import { IConfig } from 'interfaces';
import { HtmlComponents } from 'classes/HtmlComponents';
import { LayoutStore } from 'stores/LayoutStore';
import { toJS } from 'mobx';
import { Fetched } from 'stores/Fetched';
import { CssVariables } from 'classes/CssVariables';
import { Breakpoints } from 'utils/breakpoints';
import { CodeHighlight } from 'components/code-highlight';
import { TOC, TOCHeader, TOCList, TOCListItem } from 'components/toc';
import { CookieStorage, LocalStorage, SessionStorage } from 'utils/storage';
import { CLink } from 'components/link';
import { Trigger } from 'components/trigger';
import { Link } from 'routing';
import { Col, Modal, Popover, Row, Tooltip } from 'antd';
import { Icon } from 'components/icon';
import { Button } from 'components/button';
import { ApiLocalStorageCache } from 'classes/ApiLocalStorageCache';


export const containerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    decorate(injectable(), Api);

    bind<typeof LocalStorage>('storage.local').toConstantValue(LocalStorage);
    bind<typeof SessionStorage>('storage.session').toConstantValue(SessionStorage);
    bind<typeof CookieStorage>('storage.cookie').toConstantValue(CookieStorage);
    bind<Fetched>('fetched').to(Fetched).inSingletonScope();

    bind<Breakpoints>('breakpoints').to(Breakpoints).inSingletonScope();
    bind<CssVariables>('cssvars').to(CssVariables).inSingletonScope();

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
});

