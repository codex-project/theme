import Scrollbars, { ScrollbarProps as BaseScrollbarProps } from 'react-custom-scrollbars';
import React, { Ref } from 'react';

import { hot } from 'react-hot-loader';

const log = require('debug')('components:app:Scrollbar');

// https://github.com/malte-wessel/react-custom-scrollbars/blob/master/src/Scrollbars/defaultRenderElements.js
function renderTrackHorizontal({ style, ...props }) {
    const finalStyle = {
        ...style,
        right       : 2,
        bottom      : 2,
        left        : 2,
        borderRadius: 0,
    };
    return <div style={finalStyle} {...props} className="c-scroll-track-horizontal"/>;
}

function renderTrackVertical({ style, ...props }) {
    const finalStyle = {
        ...style,
        right       : 2,
        bottom      : 2,
        top         : 2,
        borderRadius: 0,
    };
    return <div style={finalStyle} {...props} className="c-scroll-track-vertical"/>;
}

function renderThumbHorizontal({ style, ...props }) {
    const finalStyle = {
        ...style,
        cursor         : 'pointer',
        borderRadius   : 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)',
    };
    return <div style={finalStyle} {...props} className="c-scroll-thumb-horizontal"/>;
}

function renderThumbVertical({ style, ...props }) {
    const finalStyle = {
        ...style,
        cursor         : 'pointer',
        borderRadius   : 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)',
    };
    return <div style={finalStyle} {...props} className="c-scroll-thumb-vertical"/>;
}

export interface ScrollbarProps extends BaseScrollbarProps {
    innerRef?:Ref<Scrollbars>
}

@hot(module)
export default class Scrollbar extends React.Component<ScrollbarProps> {

    render() {
        // https://github.com/malte-wessel/react-custom-scrollbars/blob/master/src/Scrollbars/defaultRenderElements.js
        const {innerRef,...props} = this.props
        return (
            <Scrollbars
                className="c-scrollbar"
                hideTracksWhenNotNeeded
                ref={innerRef}
                // renderThumbVertical={this.renderThumb}
                // renderTrackVertical={this.renderTrack}
                // renderThumbHorizontal={this.renderThumb}
                // renderTrackHorizontal={this.renderTrack}
                renderTrackHorizontal={renderTrackHorizontal}
                renderTrackVertical={renderTrackVertical}
                renderThumbHorizontal={renderThumbHorizontal}
                renderThumbVertical={renderThumbVertical}

                {...props}
            />
        );
    }

}
