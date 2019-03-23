import React, { Fragment } from 'react';
import { lazyInject, RouteLink, Trigger } from '@codex/core';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { FQSEN, PhpdocStore, Type } from '../../logic';
import { PhpdocType } from '../type';
import { PhpdocEntity } from '../entity';
import { PhpdocPopover } from '../popover';
import { PhpdocMethod } from '../method';
import { ManifestContext } from '../base';
import { hot } from 'react-hot-loader';
import PhpdocDrawer from '../drawer';


const log = require('debug')('phpdoc:link');

export type PhpdocLinkModifier = 'popover' | 'type' | 'icon' | 'styling'

export interface PhpdocLinkProps {
    action?: 'navigate' | 'drawer'
    modifiers?: PhpdocLinkModifier[]
    query?: string
    icon?: boolean
    fqsen: string | FQSEN

}


@hot(module)
@observer
export class PhpdocLink extends React.Component<PhpdocLinkProps> {
    static displayName                            = 'PhpdocLink';
    static defaultProps: Partial<PhpdocLinkProps> = {
        action   : 'navigate',
        modifiers: [],
    };

    static contextType = ManifestContext;
    context!: React.ContextType<typeof ManifestContext>;

    @lazyInject('store.phpdoc') store: PhpdocStore;

    @observable showDrawer: boolean = false;

    @action setShowDrawer(visible: boolean) {
        // if ( visible && this.popover && this.popover.popover ) {
        //     this.popover.popover.setState({ visible: false });
        // }
        this.showDrawer = visible;
    };

    fqsen: FQSEN;
    type: Type;


    renderLink() {
        const { fqsen, type, props }                = this;
        const { modifiers, action, children, icon } = props;
        const { manifest }                          = this.context;
        const { project, revision }                 = manifest;

        if ( modifiers.includes('type') ) {
            return (
                <PhpdocType
                    type={fqsen.fullName}
                    linkToApi={action === 'navigate'}
                    onClick={action === 'drawer' ? () => this.setShowDrawer(true) : undefined}
                    showTooltip={false}
                    showNamespace={false}
                />
            );
        }

        let linkClassName = modifiers.includes('styling') ? `c-phpdoc-${type.type}-link` : null;
        let linkChildren  = <Fragment>{modifiers.includes('icon') ? <i className={`c-phpdoc-${type.type}-icon`}/> : null} {children && children[ 'length' ] ? children : fqsen.fullName} </Fragment>;
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
                <Fragment>
                    <a
                        // href="javascript:void(0)"
                        onClick={() => this.setShowDrawer(true)}
                        className={linkClassName}
                    >
                        {linkChildren}
                    </a>
                </Fragment>
            );
        }

        return children;
    }


    render() {
        const props = this.props;
        if ( ! props.fqsen ) return null;
        this.fqsen = FQSEN.from(props.fqsen);
        this.type  = new Type(this.context.manifest, this.fqsen.fullName);
        let footerText;
        if ( props.action === 'drawer' ) {
            footerText = 'Click opens quick-preview';
        } else if ( props.action === 'navigate' ) {
            footerText = 'Click goes to documentation';
        }

        if ( this.type.isEntity && this.type.isExternal ) {
            return <span>{this.fqsen.fullName}</span>;
        }

        const maxHeight = this.fqsen.isMethod ? 200 : null;

        return (
            <Fragment>
                {/*{props.action === 'drawer' ? <PhpdocDrawer query={props.query} open={this.showDrawer} onChange={open => this.setShowDrawer(open)}/> : null}*/}
                {props.modifiers.includes('popover') ?
                 <PhpdocPopover maxHeight={maxHeight} placement="bottom" footerText={footerText}>
                     <Trigger listenTo={[ 'onMouseEnter', 'onMouseLeave', 'onClick' ]}>
                         {this.renderLink()}
                     </Trigger>
                     {this.fqsen.isEntity ? <PhpdocEntity fqsen={this.fqsen} style={{ marginBottom: 0 }} titleStyle={{ margin: 0 }}/> :
                      this.fqsen.isMethod ? <PhpdocMethod fqsen={this.fqsen} hide={{ namespace: true }}/> :
                      null}
                 </PhpdocPopover> :
                 this.renderLink()}
                 <If condition={props.action === 'drawer'}>
                     <PhpdocDrawer
                         fqsen={this.fqsen}
                         onChange={open => this.setShowDrawer(open)}
                         open={this.showDrawer}
                     >
                         Drawer Content
                     </PhpdocDrawer>
                 </If>
            </Fragment>
        );
    }
}
