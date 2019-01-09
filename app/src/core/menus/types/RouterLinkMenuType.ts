import { MenuItem } from '../MenuItem';
import { MenuType } from '../MenuType';
import { MenuItems } from '../../menus';

export class RouterLinkMenuType extends MenuType {
    name = 'router-link';

    public test(item: MenuItem): boolean {
        return item.type === 'router-link';
    }

    public handle(item: MenuItem, event, items:MenuItems) {
        if ( item.to.replace ) {
            this.app.history.replace(item.to);
        }
        this.app.history.push(item.to);
    }
}
