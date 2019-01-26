import { MenuItem } from '@codex/api';
import { MenuType } from '../MenuType';
import { MenuItems } from '../MenuItems';

export class RouterLinkMenuType extends MenuType {
    name = 'router-link';

    public test(item: MenuItem): boolean {
        return item.type === 'router-link';
    }

    public pre(item: MenuItem) {
        if ( ! item.to && item.path ) {
            let matches = this.app.routes.matchPath(item.path);
            item.to     = matches[ 0 ] ? matches[ 0 ] : item.path;
        }
        return item;
    }

    public handle(item: MenuItem, event, items: MenuItems) {
        event.preventDefault();
        if ( item.to ) {
            let url = this.app.routes.toUrl(item.to);
            if ( item.to.replace ) {
                return this.app.history.replace(url);
            }
            return this.app.history.push(url);
        }
        console.warn('RouterLinkMenuType handle :: menu ite did not have a [to] property', { item });
    }
}
