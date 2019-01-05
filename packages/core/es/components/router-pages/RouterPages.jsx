var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { hot, WithRouter } from 'decorators';
import { Route, Switch } from 'react-router-dom';
import posed, { PoseGroup } from 'react-pose';
const RoutesContainer = posed.div({
    enter: {
        opacity: 1,
        delay: 300,
        beforeChildren: true
    },
    exit: { opacity: 0 }
});
// https://popmotion.io/pose/learn/route-transitions-react-router/
let RouterPages = class RouterPages extends React.PureComponent {
    render() {
        window['routerpages'] = this;
        const { location, routes } = this.props;
        return (<PoseGroup>
                <RoutesContainer key={location.key || location.pathname}>
                    <Switch location={location}>
                        {routes.map((route, i) => <Route key={i} {...route}/>)}
                    </Switch>
                </RoutesContainer>
            </PoseGroup>);
    }
};
RouterPages.displayName = 'RouterPages';
RouterPages = __decorate([
    hot(module),
    WithRouter()
], RouterPages);
export { RouterPages };
