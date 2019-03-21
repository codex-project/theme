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
import { CodeHighlight } from 'components/code-highlight';
import { TOC, TOCHeader, TOCList, TOCListItem } from 'components/toc';
import { CLink } from 'components/link';
import { RouteLink } from 'router';
import { Trigger } from 'components/trigger';
import { Col, Modal, Popover, Row, Tooltip } from 'antd';
import { Icon } from 'components/icon';
import { Button } from 'components/button';
import { CodeRenderer } from 'components/code-renderer';
import { Emoji } from 'components/emoji';
import TaskListItem, { TaskList } from 'components/task-list';
import { Gist } from 'components/gist';
import { Scrollbar } from 'components/scrollbar';

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
    bind<HtmlComponents>('components').to(HtmlComponents).inSingletonScope().onActivation((ctx, components) => {
        components.registerMap({
            'c-code-renderer' : CodeRenderer,
            'c-code-highlight': CodeHighlight,
            'c-toc'           : TOC,
            'c-toc-list'      : TOCList,
            'c-toc-list-item' : TOCListItem,
            'c-toc-header'    : TOCHeader,
            'c-link'          : CLink,
            'c-emoji'         : Emoji,
            'c-task-list'     : TaskList,
            'c-task-list-item': TaskListItem,
            'c-gist'          : Gist,
            'c-scrollbar'     : Scrollbar,

            'link'   : RouteLink,
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

