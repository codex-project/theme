import { MenuItem } from '../MenuItem';
import { MenuItems, MenuType } from '../../menus';
import * as url from '../../utils/url';
import { SideMenuType } from './SideMenuType';
import { toJS } from 'mobx';

const name = 'projects';
const log  = require('debug')('menus:types:' + name);

export class ProjectsMenuType extends MenuType {
    name = name;

    public test(item: MenuItem): boolean {
        return item.projects !== undefined;
    }

    public pre(item: MenuItem) {
        let { store, menus } = this.app;
        item.children        = [
            { type: 'header', label: 'Projects' },
            { type: 'divider' },
        ];
        toJS(store.codex.projects).forEach(project => {
            let default_document = store.getRevision(project.key, project.default_revision).default_document;
            let child: MenuItem  = {
                type    : 'router-link',
                to      : { pathname: url.documentation(`${project.key}/${project.default_revision}/${default_document}`) },
                icon    : 'book',
                label   : project.display_name,
                sublabel: project.description,
                selected: `<%= store.project && store.project.key === "${project.key}" %>` as any,
                renderer: 'big',
            };

            item.children.push(child);
        });
        item.children = menus.apply(item.children, item);
        return item;
    }

    public boot() {
        // this.app.menus.getType<SideMenuType>('side-menu').hooks.child.tap('ProjectsMenuType', (child, ctx) => {
        //     if ( this.test(ctx.parent) ) {
        //         child.custom = () => ctx.close();
        //     }
        //     return child;
        // });
    }
}
