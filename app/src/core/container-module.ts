import { ContainerModule } from 'inversify';
import { CookieStorage, LocalStorage, SessionStorage } from './utils/storage';
import { Breakpoints } from './utils/breakpoints';
import { CssVariables } from './classes/CssVariables';
import { HtmlParser } from './classes/HtmlParser';
import { ApiLocalStorageCache } from 'classes/ApiLocalStorageCache';
import { IConfig } from 'interfaces';
import { Api } from '@codex/api';
import { Fetched, LayoutStore, Store } from 'stores';
import { decorate, injectable } from 'ioc';
import { toJS } from 'mobx';
import { CodeHighlight } from 'components/code-highlight';
import { TOC, TOCHeader, TOCList, TOCListItem } from 'components/toc';
import { CLink } from 'components/link';
import { AnimatedViews, RouteLink, Routes, Switch, View } from 'router';
import { Trigger } from 'components/trigger';
import { BackTop, Col, Layout, Modal, Popover, Row, Tooltip } from 'antd';
import { Icon } from 'components/icon';
import { Button } from 'components/button';
import { CodeRenderer } from 'components/code-renderer';
import { Emoji } from 'components/emoji';
import { TaskList, TaskListItem } from 'components/task-list';
import { Gist } from 'components/gist';
import { Scrollbar } from 'components/scrollbar';
import { Tab, Tabs } from 'components/tabs';
import { LayoutBreadcrumbs, LayoutFooter, LayoutHeader, LayoutSide } from 'components/layout';
import { ComponentRegistry } from 'classes/ComponentRegistry';
import { DynamicMenu } from 'components/dynamic-menu';
import { OffCanvas } from 'components/off-canvas';
import { Responsive } from 'components/responsive';
import { Toolbar, ToolbarItem } from 'components/toolbar';
import { Tunnel, TunnelPlaceholder } from 'components/tunnel';
import { Affix } from 'components/affix';

export const containerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    decorate(injectable(), Api);
    bind<Fetched>('fetched').to(Fetched).inSingletonScope();
    bind<Store>('store').to(Store).inSingletonScope();
    bind<LayoutStore>('store.layout').to(LayoutStore).inSingletonScope().onActivation((ctx, layout) => {
        layout.merge(toJS(ctx.container.get<Store>('store').codex.layout));
        return layout;
    });

    // dfssfd
    bind<typeof LocalStorage>('storage.local').toConstantValue(LocalStorage);
    bind<typeof SessionStorage>('storage.session').toConstantValue(SessionStorage);
    bind<typeof CookieStorage>('storage.cookie').toConstantValue(CookieStorage);
    bind<Breakpoints>('breakpoints').to(Breakpoints).inSingletonScope();
    bind<CssVariables>('cssvars').to(CssVariables).inSingletonScope();

    bind<Api>('api').to(Api).inSingletonScope().onActivation((ctx, api) => {
        const c = ctx.container.get<IConfig>('config');
        api.configure(c.api);
        if ( c.cache ) {
            const cache = new ApiLocalStorageCache();
            cache.apply(api);
        }
        return api;
    });


    const cr = new ComponentRegistry();
    bind('components').toConstantValue(cr);

    cr.registerMap({
        // components
        'affix'             : Affix,
        'button'            : Button,
        'code-renderer'     : CodeRenderer,
        'code-highlight'    : CodeHighlight,
        'dynamic-menu'      : DynamicMenu,
        'emoji'             : Emoji,
        'gist'              : Gist,
        'icon'              : Icon as any,
        'container'         : Layout,
        'layout-side'       : LayoutSide,
        'layout-header'     : LayoutHeader,
        'layout-footer'     : LayoutFooter,
        'layout-content'    : Layout.Content,
        'layout-breadcrumbs': LayoutBreadcrumbs,
        'link'              : CLink,
        'off-canvas'        : OffCanvas,
        'responsive'        : Responsive,
        'scrollbar'         : Scrollbar,
        'tabs'              : Tabs,
        'tab'               : Tab,
        'task-list'         : TaskList,
        'task-list-item'    : TaskListItem,
        'toc'               : TOC,
        'toc-list'          : TOCList,
        'toc-list-item'     : TOCListItem,
        'toc-header'        : TOCHeader,
        'toolbar'           : Toolbar,
        'toolbar-item'      : ToolbarItem,
        'trigger'           : Trigger,
        'tunnel'            : Tunnel,
        'tunnel-placeholder': TunnelPlaceholder,

        // router components
        'animated-views': AnimatedViews,
        'route-link'    : RouteLink,
        'routes'        : Routes,
        'switch'        : Switch,
        'view'          : View,

        // antd components
        'back-to-top': BackTop,
        'modal'      : Modal,
        'col'        : Col,
        'row'        : Row,
        'tooltip'    : Tooltip,
        'popover'    : Popover,
    });

    bind<HtmlParser>('htmlparser').to(HtmlParser).inSingletonScope();
});

