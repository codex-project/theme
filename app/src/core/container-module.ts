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
import { CLink, CLinkProps } from 'components/link';
import { AnimatedViews, AnimatedViewsProps, RouteLink, RouteLinkProps, Routes, RoutesProps, Switch, SwitchProps, View, ViewProps } from 'router';
import { Trigger, TriggerProps } from 'components/trigger';
import { BackTop, Layout, Modal, Popover, Tooltip } from 'antd';
import { Icon, IconProps } from 'components/icon';
import { Button, ButtonProps } from 'components/button';
import { CodeRenderer } from 'components/code-renderer';
import { Emoji } from 'components/emoji';
import { TaskList, TaskListItem, TaskListItemProps, TaskListProps } from 'components/task-list';
import { Gist, GistProps } from 'components/gist';
import { Scrollbar } from 'components/scrollbar';
import { Tab, Tabs } from 'components/tabs';
import { LayoutBreadcrumbs, LayoutBreadcrumbsProps, LayoutFooter, LayoutFooterProps, LayoutHeader, LayoutHeaderProps, LayoutProps, LayoutSide, LayoutSideProps, LayoutToolbar, LayoutToolbarProps } from 'components/layout';
import { ComponentRegistry } from 'classes/ComponentRegistry';
import { DynamicMenu } from 'components/dynamic-menu';
import { OffCanvas } from 'components/off-canvas';
import { Responsive, ResponsiveProps } from 'components/responsive';
import { Toolbar, ToolbarColumn, ToolbarItem, ToolbarItemProps, ToolbarSpacer } from 'components/toolbar';
import { Tunnel, TunnelPlaceholder, TunnelPlaceholderProps, TunnelProps } from 'components/tunnel';
import { Affix } from 'components/affix';
import { Hyperstring, HyperstringProps } from 'components/Hyperstring';

import { AffixProps } from 'antd/es/affix';
import { CodeRendererProps } from 'components/code-renderer/CodeRenderer';
import { CodeHighlightProps } from 'components/code-highlight/CodeHighlight';
import { ScrollbarProps } from 'components/scrollbar/Scrollbar';
import { EmojiProps } from 'components/emoji/Emoji';
import { TOCHeaderProps } from 'components/toc/TOCHeader';

import { TOCProps } from 'components/toc/TOC';
import { DynamicMenuProps } from 'components/dynamic-menu/DynamicMenu';
import { ToolbarProps } from 'components/toolbar/Toolbar';
import { OffCanvasProps } from 'components/off-canvas/OffCanvas';
import { TOCListProps } from 'components/toc/TOCList';
import { TOCListItemProps } from 'components/toc/TOCListItem';
import { TabProps } from 'components/tabs/Tab';
import { TabsProps } from 'components/tabs/Tabs';
import { TooltipProps } from 'antd/lib/tooltip';
import { ModalProps } from 'antd/es/modal';
import { BackTopProps } from 'antd/es/back-top';
import { ColProps, RowProps } from 'antd/es/grid';
import { PopoverProps } from 'antd/es/popover';
import { Col, Row } from 'components/grid';

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
        'c-affix'             : Affix,
        'c-button'            : Button,
        'c-code-renderer'     : CodeRenderer,
        'c-code-highlight'    : CodeHighlight,
        'c-dynamic-menu'      : DynamicMenu,
        'c-emoji'             : Emoji,
        'c-gist'              : Gist,
        'c-icon'              : Icon as any,
        'c-container'         : Layout,
        'c-layout-side'       : LayoutSide,
        'c-layout-header'     : LayoutHeader,
        'c-layout-footer'     : LayoutFooter,
        'c-layout-content'    : Layout.Content,
        'c-layout-breadcrumbs': LayoutBreadcrumbs,
        'c-layout-toolbar'    : LayoutToolbar,
        'c-link'              : CLink,
        'c-off-canvas'        : OffCanvas,
        'c-responsive'        : Responsive,
        'c-scrollbar'         : Scrollbar,
        'c-tabs'              : Tabs,
        'c-tab'               : Tab,
        'c-task-list'         : TaskList,
        'c-task-list-item'    : TaskListItem,
        'c-toc'               : TOC,
        'c-toc-list'          : TOCList,
        'c-toc-list-item'     : TOCListItem,
        'c-toc-header'        : TOCHeader,
        'c-toolbar'           : Toolbar,
        'c-toolbar-item'      : ToolbarItem,
        'c-toolbar-spacer'    : ToolbarSpacer,
        'c-toolbar-column'    : ToolbarColumn,
        'c-trigger'           : Trigger,
        'c-tunnel'            : Tunnel,
        'c-tunnel-placeholder': TunnelPlaceholder,

        'c-hyper': Hyperstring,

        // router components
        'c-animated-views': AnimatedViews,
        'c-route-link'    : RouteLink,
        'c-routes'        : Routes,
        'c-switch'        : Switch,
        'c-view'          : View,

        // antd components
        'c-back-to-top': BackTop,
        'c-modal'      : Modal,
        'c-col'        : Col,
        'c-row'        : Row,
        'c-tooltip'    : Tooltip,
        'c-popover'    : Popover,

        'ant-layout'        : Layout,
        'ant-layout-header' : Layout.Header,
        'ant-layout-footer' : Layout.Footer,
        'ant-layout-content': Layout.Content,
        'ant-layout-sider'  : Layout.Sider,
    });

    bind<HtmlParser>('htmlparser').to(HtmlParser).inSingletonScope();
});


declare module 'codex-components' {


    interface Components {
        // components
        'c-affix': AffixProps,
        'c-button': ButtonProps,
        'c-code-renderer': CodeRendererProps
        'c-code-highlight': CodeHighlightProps
        'c-dynamic-menu': DynamicMenuProps
        'c-emoji': EmojiProps
        'c-gist': GistProps
        'c-icon': IconProps
        'c-container': LayoutProps
        'c-layout-side': LayoutSideProps
        'c-layout-header': LayoutHeaderProps
        'c-layout-footer': LayoutFooterProps
        'c-layout-content': LayoutProps
        'c-layout-breadcrumbs': LayoutBreadcrumbsProps
        'c-layout-toolbar': LayoutToolbarProps
        'c-link': CLinkProps
        'c-off-canvas': OffCanvasProps
        'c-responsive': ResponsiveProps
        'c-scrollbar': ScrollbarProps
        'c-tabs': TabsProps
        'c-tab': TabProps
        'c-task-list': TaskListProps
        'c-task-list-item': TaskListItemProps
        'c-toc': TOCProps
        'c-toc-list': TOCListProps
        'c-toc-list-item': TOCListItemProps
        'c-toc-header': TOCHeaderProps
        'c-toolbar': ToolbarProps
        'c-toolbar-item': ToolbarItemProps
        'c-trigger': TriggerProps
        'c-tunnel': TunnelProps
        'c-tunnel-placeholder': TunnelPlaceholderProps

        'c-hyper': HyperstringProps,
        // router components
        'c-animated-views': AnimatedViewsProps
        'c-route-link': RouteLinkProps
        'c-routes': RoutesProps
        'c-switch': SwitchProps
        'c-view': ViewProps

        // antd components
        'c-back-to-top': BackTopProps
        'c-modal': ModalProps
        'c-col': ColProps
        'c-row': RowProps
        'c-tooltip': TooltipProps
        'c-popover': PopoverProps
    }
}
