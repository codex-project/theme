import React from 'react';
import { CLinkStore } from 'stores';
import { loader } from 'components/loader';

export * from './CLink';
export * from './PopoverAction';
export * from './LinkType';

const styleLoader = async () => await import(/* webpackChunkName: "core.components.link" */'./link.scss');

function registerType(name: string, ComponentLoader) {
    const Component = loader({
        loadable      : [ ComponentLoader, styleLoader ],
        animated      : false,
        showLoading   : true,
        loadingOptions: { delay: 1000 },
    });
    CLinkStore.instance.registerType(name, Component);
    return Component;
}

function registerAction(type: string, action: string, ComponentLoader) {
    const Component = loader({
        loadable      : [ ComponentLoader, styleLoader ],
        animated      : false,
        showLoading   : true,
        loadingOptions: { delay: 1000 },
    });
    CLinkStore.instance.registerAction(type, action, Component);
    return Component;
}

//
// registerType('project', async () => (await import(/* webpackChunkName: "core.components.link" */'./ProjectLinkType')).ProjectLinkType);
// registerType('revision', async () => (await import(/* webpackChunkName: "core.components.link" */'./RevisionLinkType')).RevisionLinkType);
// registerType('document', async () => (await import(/* webpackChunkName: "core.components.link" */'./DocumentLinkType')).DocumentLinkType);
// registerAction('project', 'popover', async () => (await import(/* webpackChunkName: "core.components.link" */'./ProjectPopoverAction')).ProjectPopoverAction);
// registerAction('revision', 'popover', async () => (await import(/* webpackChunkName: "core.components.link" */'./RevisionPopoverAction')).RevisionPopoverAction);
// registerAction('document', 'popover', async () => (await import(/* webpackChunkName: "core.components.link" */'./DocumentPopoverAction')).DocumentPopoverAction);

registerType('project', () => import(/* webpackChunkName: "core.components.link" */'./ProjectLinkType'));
registerType('revision', () => import(/* webpackChunkName: "core.components.link" */'./RevisionLinkType'));
registerType('document', () => import(/* webpackChunkName: "core.components.link" */'./DocumentLinkType'));
registerAction('project', 'popover', () => import(/* webpackChunkName: "core.components.link" */'./ProjectPopoverAction'));
registerAction('revision', 'popover', () => import(/* webpackChunkName: "core.components.link" */'./RevisionPopoverAction'));
registerAction('document', 'popover', () => import(/* webpackChunkName: "core.components.link" */'./DocumentPopoverAction'));
