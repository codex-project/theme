import { MenuItem } from '../MenuItem';
import { MenuType } from '../MenuType';

export class RevisionMenuType extends MenuType {
    name = 'revision';

    public test(item: MenuItem): boolean {
        return item.revision !== undefined;
    }

    public pre(item: MenuItem): MenuItem {
        let store  = this.app.store;
        item.type  = 'router-link';
        let params = {
            project : item.project || (store.project ? store.project.key : store.codex.default_project),
            revision: item.revision || store.revision.key,
        };
        // if ( ! store.hasProject(params.project) ) {
        //     item.to = { pathname: url.documentation() };
        //     return item;
        // }
        // let project = store.getProject(params.project);
        // item.to     = { pathname: url.documentation(`${params.project}/${params.revision}/${project.revisions[ project.default_revision ]}`) };
        item.to = { name: 'documentation.revision', params };
        return item;
    }
}
