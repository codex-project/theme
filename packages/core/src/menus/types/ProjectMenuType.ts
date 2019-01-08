import { MenuItem } from '@codex/api';
import * as url from '../../utils/url';
import { MenuType } from '../MenuType';

export class ProjectMenuType extends MenuType {
    name = 'project';

    public test(item: MenuItem): boolean {
        return item.project !== undefined;
    }

    public pre(item: MenuItem): MenuItem {
        let store  = this.app.store;
        item.type  = 'router-link';
        let params = {
            project: item.project || (store.project ? store.project.key : store.codex.default_project),
        };
        if ( ! store.hasProject(params.project) ) {
            item.to = { pathname: url.documentation() };
            return item;
        }
        let project = store.getProject(params.project);
        item.to     = { pathname: url.documentation(`${params.project}/${project.default_revision}/${project.revisions[ project.default_revision ]}`) };
        return item;
    }
}
