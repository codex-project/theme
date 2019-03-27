import React, { Component } from 'react';


import { animated, config, Transition, TransitionProps } from 'react-spring/renderprops';
import { Omit } from 'interfaces';
import { State } from '../State';
import { hot } from 'react-hot-loader';

const log = require('debug')('router:AnimatedViews');

const AnimatedViewContainer = animated.div;


export interface AnimatedViewsBaseProps {
    children: (state) => React.ReactChild
    state: State

}

export type AnimatedViewsProps = AnimatedViewsBaseProps & Partial<Omit< TransitionProps<State>, 'children' >>
@hot(module)
export class AnimatedViews extends Component<AnimatedViewsProps> {
    static displayName                               = 'AnimatedViews';
    static defaultProps: Partial<AnimatedViewsProps> = {
        config: config.slow,
    };

    render() {
        const { children, state, ...props } = this.props;
        return (
            <Transition
                native
                {...props as any}
                items={state}
                keys={state.url}
            >
                {(item, itemState, index) => style => <AnimatedViewContainer style={style}>{children(item)}</AnimatedViewContainer>}
            </Transition>
        );
    }
}
