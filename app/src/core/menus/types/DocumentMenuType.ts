import { MenuItem } from '../MenuItem';
import { MenuType } from '../MenuType';

export class DocumentMenuType extends MenuType {
    name = 'document';

    public test(item: MenuItem): boolean {
        return item.document !== undefined;
    }

    public pre(item: MenuItem): MenuItem {
        let store  = this.app.store;
        item.type  = 'router-link';
        let params = {
            project : item.project || (store.project ? store.project.key : store.codex.default_project),
            revision: item.revision || store.revision.key,
            document: item.document,
        };
        item.to    = { name: 'documentation.document', params };
        return item;
    }
}
