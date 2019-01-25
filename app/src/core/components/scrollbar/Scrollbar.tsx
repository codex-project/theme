import Scrollbars, { ScrollbarProps as BaseScrollbarProps } from 'react-custom-scrollbars';
import React from 'react';

import { hot } from 'decorators';

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

}

@hot(module)
export class Scrollbar extends React.Component<ScrollbarProps> {
    scrollbars: Scrollbars;

    render() {
        // https://github.com/malte-wessel/react-custom-scrollbars/blob/master/src/Scrollbars/defaultRenderElements.js
        return (
            <Scrollbars
                className="c-scrollbar"
                hideTracksWhenNotNeeded
                ref={ref => this.scrollbars = ref}
                // renderThumbVertical={this.renderThumb}
                // renderTrackVertical={this.renderTrack}
                // renderThumbHorizontal={this.renderThumb}
                // renderTrackHorizontal={this.renderTrack}
                renderTrackHorizontal={renderTrackHorizontal}
                renderTrackVertical={renderTrackVertical}
                renderThumbHorizontal={renderThumbHorizontal}
                renderThumbVertical={renderThumbVertical}

                {...this.props}
            />
        );
    }

}
