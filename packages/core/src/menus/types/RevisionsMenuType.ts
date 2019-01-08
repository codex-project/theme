import { MenuItem } from '@codex/api';
import * as url from '../../utils/url';
import { MenuType } from '../MenuType';
import { toJS } from 'mobx';

export class RevisionsMenuType extends MenuType {
    name = 'revisions';

    public test(item: MenuItem): boolean {
        return item.revisions !== undefined;
    }

    public pre(item: MenuItem): MenuItem {
        let store     = this.app.store;
        item.children = [
            { type: 'header', label: 'revisions' },
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
                type : 'router-link',
                to   : { pathname: url.documentation(`${project.key}/${revision.key}/${revision.default_document}`) },
                label: revision.key,
            });
        });
        item.children = this.app.menus.apply(item.children, item);
        return item;
    }
}
