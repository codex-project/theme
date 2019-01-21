import { componentLoader } from 'utils/componentLoader';
import React from 'react';
import { CLinkStore } from 'stores/CLinkStore';

export * from './CLink';
export * from './PopoverAction';
export * from './LinkType';

function registerType(name: string, ComponentLoader) {
    const Component = componentLoader(
        {
            Component: ComponentLoader,
            style    : async () => await import(/* webpackChunkName: "core.components.link" */'./link.scss'),
        },
        (loader: any, props: any) => <loader.Component {...props} />,
        { delay: 1000 },
    );
    CLinkStore.instance.registerType(name, Component);
    return Component;
}

function registerAction(type: string, action: string, ComponentLoader) {
    const Component = componentLoader(
        {
            Component: ComponentLoader,
            style    : async () => await import(/* webpackChunkName: "core.components.link" */'./link.scss'),
        },
        (loader: any, props: any) => <loader.Component {...props} />,
        { delay: 1000 },
    );
    CLinkStore.instance.registerAction(type, action, Component);
    return Component;
}

registerType('project', async () => (await import(/* webpackChunkName: "core.components.link" */'./ProjectLinkType')).ProjectLinkType);
registerType('revision', async () => (await import(/* webpackChunkName: "core.components.link" */'./RevisionLinkType')).RevisionLinkType);
registerType('document', async () => (await import(/* webpackChunkName: "core.components.link" */'./DocumentLinkType')).DocumentLinkType);
registerAction('project', 'popover', async () => (await import(/* webpackChunkName: "core.components.link" */'./ProjectPopoverAction')).ProjectPopoverAction);
registerAction('revision', 'popover', async () => (await import(/* webpackChunkName: "core.components.link" */'./RevisionPopoverAction')).RevisionPopoverAction);
registerAction('document', 'popover', async () => (await import(/* webpackChunkName: "core.components.link" */'./DocumentPopoverAction')).DocumentPopoverAction);
