import { MenuItem } from '../MenuItem';
import * as url from '../../utils/url';
import { MenuType } from '../MenuType';
import { toJS } from 'mobx';
import { SideMenuType } from 'menus/types/SideMenuType';

export class RevisionsMenuType extends MenuType {
    name = 'revisions';

    public test(item: MenuItem): boolean {
        return item.revisions !== undefined;
    }

    public pre(item: MenuItem): MenuItem {
        let store     = this.app.store;
        item.children = [
            { type: 'header', label: 'Revisions' },
            { type: 'divider' },
        ];
        let params    = {
            project: item.project || (store.project ? store.project.key : store.codex.default_project),
        };
        if ( ! store.hasProject(params.project) ) {
            item.to = { pathname: url.documentation() };
            return item;
        }
        let project = store.getProject(params.project);

        toJS(project.revisions).forEach(revision => {
            item.children.push({
                type    : 'router-link',
                icon    : 'fa-code-fork',
                to      : { pathname: url.documentation(`${project.key}/${revision.key}/${revision.default_document}`) },
                label   : revision.key,
                selected: store.project && store.project.key === project.key && store.revision && store.revision.key === revision.key,
            });
        });
        item.children = this.app.menus.apply(item.children, item);
        return item;
    }
    public boot() {
        this.app.menus.getType<SideMenuType>('side-menu').hooks.child.tap('RevisionsMenuType', (child, ctx) => {
            if ( this.test(ctx.parent) ) {
                child.custom = () => ctx.close()
            }
            return child;
        });
    }
}
