import React, { Fragment } from 'react';
import { hot, lazyInject, RouteLink, Trigger } from '@codex/core';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { FQNS, PhpdocStore, Type } from '../../logic';
import PhpdocType from '../type';
import PhpdocEntity from '../entity';
import PhpdocPopover from '../popover';
import PhpdocMethod from '../method';
import { ManifestCtx } from '../base';

export { PhpdocLink };

const log = require('debug')('phpdoc:link');

export type PhpdocLinkModifier = 'popover' | 'type' | 'icon' | 'styling'

export interface PhpdocLinkProps {
    action?: 'navigate' | 'drawer'
    modifiers?: PhpdocLinkModifier[]
    query?: string
    icon?: boolean
    fqns: string | FQNS

}


@hot(module)
@observer
export default class PhpdocLink extends React.Component<PhpdocLinkProps> {
    static displayName                            = 'PhpdocLink';
    static defaultProps: Partial<PhpdocLinkProps> = {
        action   : 'navigate',
        modifiers: [],
    };

    static contextType = ManifestCtx;
    context!: React.ContextType<typeof ManifestCtx>;

    @lazyInject('store.phpdoc') store: PhpdocStore;

    @observable showDrawer: boolean = false;

    @action setShowDrawer(visible: boolean) {
        // if ( visible && this.popover && this.popover.popover ) {
        //     this.popover.popover.setState({ visible: false });
        // }
        this.showDrawer = visible;
    };

    fqns: FQNS;
    type: Type;


    renderLink() {
        const { fqns, type, props }                 = this;
        const { modifiers, action, children, icon } = props;
        const { manifest }                          = this.context;
        const { project, revision }                 = manifest;

        if ( modifiers.includes('type') ) {
            return (
                <PhpdocType
                    type={fqns.fullName}
                    linkToApi={action === 'navigate'}
                    onClick={action === 'drawer' ? () => this.setShowDrawer(true) : undefined}
                    showTooltip={false}
                    showNamespace={false}
                />
            );
        }

        let linkClassName = modifiers.includes('styling') ? `c-phpdoc-${type.type}-link` : null;
        let linkChildren  = <Fragment>{modifiers.includes('icon') ? <i className={`c-phpdoc-${type.type}-icon`}/> : null} {children && children[ 'length' ] ? children : fqns.fullName} </Fragment>;
        if ( action === 'navigate' ) {
            return (
                <RouteLink
                    to={{ name: 'phpdoc', params: { project, revision }, hash: type.toQuery().toHash() }}
                    className={linkClassName}
                >
                    {linkChildren}
                </RouteLink>
            );
        }
        if ( action === 'drawer' ) {
            return (
                <a
                    href="javascript:void(0)"
                    onClick={() => this.setShowDrawer(true)}
                    className={linkClassName}
                >
                    {linkChildren}
                </a>
            );
        }

        return children;
    }


    render() {
        const props = this.props;
        if ( ! props.fqns ) return null;
        this.fqns = FQNS.from(props.fqns);
        this.type = new Type(this.context.manifest, this.fqns.fullName);
        let footerText;
        if ( props.action === 'drawer' ) {
            footerText = 'Click opens quick-preview';
        } else if ( props.action === 'navigate' ) {
            footerText = 'Click goes to documentation';
        }

        return (
            <Fragment>
                {/*{props.action === 'drawer' ? <PhpdocDrawer query={props.query} open={this.showDrawer} onChange={open => this.setShowDrawer(open)}/> : null}*/}
                {props.modifiers.includes('popover') ?
                 <PhpdocPopover maxHeight={200} placement="bottom" footerText={footerText}>
                     <Trigger listenTo={[ 'onMouseEnter', 'onMouseLeave', 'onClick' ]}>
                         {this.renderLink()}
                     </Trigger>
                     {this.fqns.isEntity ? <PhpdocEntity fqns={this.fqns} style={{ marginBottom: 0 }} titleStyle={{ margin: 0 }}/> :
                      this.fqns.isMethod ? <PhpdocMethod fqns={this.fqns} hide={{ namespace: true }}/> :
                      null}
                 </PhpdocPopover> :
                 this.renderLink()}
            </Fragment>
        );
    }
}
