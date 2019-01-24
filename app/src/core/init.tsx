import { app } from 'ioc';
import { configure } from 'mobx';
import { containerModule } from './container-module';
import { ColorElement } from './elements/ColorElement';
import { RouterPlugin } from 'routing/plugin';
import { DocumentationProjectRoute, DocumentationRevisionRoute, DocumentationRoute, HomeRoute } from './routes';
import { MenuPlugin } from 'menus/plugin';


const log = require('debug')('index');

//mobx
configure({ enforceActions: 'never' });

app.load(containerModule);
app.plugin(new MenuPlugin());
app.plugin(new RouterPlugin({
    routes: [
        new HomeRoute(),
        new DocumentationRoute(),
        new DocumentationProjectRoute(),
        new DocumentationRevisionRoute(),
    ],
}));
app.plugins.get<MenuPlugin>('menu').hooks.register.tap('CORE', manager => {

});
customElements.define(ColorElement.TAG, ColorElement);
