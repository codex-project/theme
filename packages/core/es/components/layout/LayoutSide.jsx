var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as React from 'react';
import { lazyInject } from 'ioc';
import { Store } from 'stores';
import { observer } from 'mobx-react';
import { hot } from 'decorators';
import { Layout } from 'antd';
import './layout.mscss';
import { DynamicMenu } from 'components/dynamic-menu';
const { Header, Footer, Sider, Content } = Layout;
const log = require('debug')('components:layout:sidebar');
let LayoutSide = class LayoutSide extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { collapsedBeforeResponsive: null };
    }
    componentDidMount() {
        let side = this.store.layout[this.props.side];
        this.setState({ collapsedBeforeResponsive: side.collapsed });
    }
    render() {
        // let { left, right, header, footer, content, middle } = this.store.layout;
        // let { children }                                     = this.props
        let side = this.store.layout[this.props.side];
        return (<Sider collapsible styleName="sidebar" breakpoint="xs" style={side.computedStyle} className={side.computedClass} width={side.width} defaultCollapsed={true} collapsed={side.collapsed} collapsedWidth={side.collapsedWidth} trigger={null} onCollapse={(collapsed, type) => {
            log('onCollapse', this.props.side, { type, collapsed, collapsedBeforeResponsive: this.state.collapsedBeforeResponsive });
            if (type === 'responsive') {
                if (collapsed !== this.state.collapsedBeforeResponsive) {
                    return;
                }
            }
            side.setCollapsed(collapsed);
        }}>
                <DynamicMenu styleName="sidebar-menu" items={side.menu} subMenuCloseDelay={side.collapsed ? 0.2 : 1} mode="inline"/>
            </Sider>);
    }
};
LayoutSide.displayName = 'LayoutSidebar';
LayoutSide.defaultProps = {};
__decorate([
    lazyInject('store'),
    __metadata("design:type", Store)
], LayoutSide.prototype, "store", void 0);
LayoutSide = __decorate([
    hot(module),
    observer
], LayoutSide);
export { LayoutSide };
