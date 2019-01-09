import { MenuItem } from '../MenuItem';
import { MenuType } from '../../menus';
import { toJS } from 'mobx';
import * as url from '../../utils/url';

const name = 'projects';
const log  = require('debug')('menus:types:' + name);

export class ProjectsMenuType extends MenuType {
    name = name;

    public test(item: MenuItem): boolean {
        return item.projects !== undefined;
    }

    public pre(item: MenuItem) {
        log('pre', { item, event });
        let { store, menus } = this.app;
        item.children        = [
            { type: 'header', label: 'Projects' },
            { type: 'divider' },
        ];
        toJS(store.codex.projects).forEach(project => {
            let default_document = store.getRevision(project.key, project.default_revision).default_document;
            item.children.push({
                type    : 'router-link',
                to      : { pathname: url.documentation(`${project.key}/${project.default_revision}/${default_document}`) },
                icon    : 'fa-folder',
                label   : project.display_name,
                sublabel: project.description,
            });
        });
        item.children = menus.apply(item.children, item);
        return item;
    }
}
