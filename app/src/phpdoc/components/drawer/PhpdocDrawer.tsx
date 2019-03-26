import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { FQSENComponent, FQSENComponentContext, FQSENComponentProps } from '../base';
import { h, Omit } from '@codex/core';
import { Drawer } from 'antd';
import { DrawerProps } from 'antd/es/drawer';

import memo from 'memoize-one';
import { PhpdocEntity } from '../entity';
import { PhpdocDocblock } from '../docblock';
import { PhpdocMemberList } from '../member-list';
import { Members } from '../members';


const log = require('debug')('phpdoc:Drawer');

export interface PhpdocDrawerProps extends Omit<Partial<DrawerProps>, 'onClose'>, Partial<FQSENComponentProps> {
    onChange?(visible: boolean)
}


@hot(module)
@FQSENComponent()
export default class PhpdocDrawer extends Component<PhpdocDrawerProps> {
    static displayName                              = 'PhpdocDrawer';
    static defaultProps: Partial<PhpdocDrawerProps> = {
        onChange: v => null,
    };
    static contextType                              = FQSENComponentContext;
    context!: React.ContextType<typeof FQSENComponentContext>;
    state                                           = { show: false, width: '50%' };

    constructor(props, context: any) {
        super(props, context);
        new.target.preload();
    }

    setWidth     = (width: string | number) => this.state.width !== width && this.setState({ width });
    setShow      = (show: boolean = true) => {
        if ( show !== this.state.show ) {
            this.setState({ show }, () => this.props.onChange(show));
        }
    };
    show         = () => { this.setShow(true);};
    hide         = () => { this.setShow(false);};
    renderEntity = memo((fqsen, manifest, file) => {
        return h('div', {}, h([
            h('phpdoc-entity', { fqsen }),
            h('phpdoc-docblock', { docblock: file.docblock }),
            h('phpdoc-docblock', { docblock: file.entity.docblock }),
            h(Members, {
                fqsen, height: 500,
                selectable   : true, searchable: true, filterable: true,
                methods      : {
                    hide: {
                        namespace       : true,
                        argumentDefaults: true,
                        typeTooltip     : true,
                        // typeTooltipClick: true,
                    },
                },
            }),
        ]));
    });

    public componentDidMount(): void {
        if ( this.props.visible !== undefined ) {
            this.setShow(this.props.visible);
        }
        if ( this.props.width !== undefined ) {
            this.setWidth(this.props.width);
        }
    }

    componentDidUpdate(prevProps: Readonly<PhpdocDrawerProps & FQSENComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if ( prevProps.visible !== this.props.visible ) {
            this.setShow(this.props.visible);
        }
        if ( prevProps.width !== this.props.width ) {
            this.setWidth(this.props.width);
        }
    }

    render() {
        const { children, ...props }    = this.props;
        const { fqsen, manifest, file } = this.context;
        const { width, show }           = this.state;
        return (
            <Drawer
                {...props}
                closable={true}
                visible={show}
                width={width}
                onClose={this.hide}
                duration="0.2s"
            >
                {show ? this.renderEntity(fqsen, manifest, file) : null}
            </Drawer>
        );
    }

    static preload() {
        PhpdocEntity.preload();
        PhpdocDocblock.preload();
        PhpdocMemberList.preload();
    }
}

