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
            let state = this.app.routes.matchPath(item.path);
            item.to   = state;
        }
        return item;
    }

    public handle(item: MenuItem, event, items: MenuItems) {
        if ( item.to ) {
            let {name, params, ...opts} = item.to
            return this.app.history.push(this.app.routes.generatePath(item.to.name, item.to.params));
        }
        console.warn('RouterLinkMenuType handle :: menu ite did not have a [to] property', {item})
    }
}
