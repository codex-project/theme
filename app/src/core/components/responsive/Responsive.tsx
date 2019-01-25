import { Responsive as BaseResponsive, ResponsiveProps as BaseResponsiveProps } from 'semantic-ui-react';
import React from 'react';


import { hot } from 'decorators';
import { lazyInject } from 'ioc';
import { observer } from 'mobx-react';
import { ResponsiveOnUpdateData } from 'semantic-ui-react/dist/commonjs/addons/Responsive';
import { BreakpointKey, Breakpoints } from 'utils/breakpoints';
import { CssVariables } from 'classes/CssVariables';

export interface ResponsiveProps extends Record<BreakpointKey, boolean> {
    breakpoint?: BreakpointKey

    min?: boolean
    max?: boolean

    as?: any
    fireOnMount?: boolean
    onUpdate?: (event: React.SyntheticEvent<HTMLElement>, data: ResponsiveOnUpdateData) => void
}

@hot(module)
@observer
export class Responsive extends React.Component<ResponsiveProps> {
    @lazyInject('cssvars') cssvars: CssVariables;
    @lazyInject('breakpoints') breakpoints: Breakpoints;

    public render() {
        let { children, breakpoint, min, max, as, fireOnMount, onUpdate } = this.props;
        if ( ! breakpoint ) {
            breakpoint = this.breakpoints.keys.find(key => this.props[ key ] === true);
        }
        if ( ! breakpoint ) {
            throw new Error('No breakpoint specified');
        }

        let props: BaseResponsiveProps = { as, fireOnMount, onUpdate };
        if ( min ) {
            props.minWidth = this.breakpoints.get(breakpoint).min.int();
        }
        if ( max ) {
            props.maxWidth = this.breakpoints.get(breakpoint).max.int();
        }

        return (
            <BaseResponsive {...props}>
                {children}
            </BaseResponsive>
        );
    }
}
