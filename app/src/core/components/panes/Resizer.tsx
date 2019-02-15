import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import styled from 'utils/styled';

const Wrapper = styled.div({
    background    : '#000',
    opacity       : 0.2,
    zIndex        : 1,
    boxSizing     : 'border-box',
    backgroundClip: 'padding-box',

    $next: {
        '&:hover': {
            transition: 'all 2s ease',
        },
    },
});

const HorizontalWrapper = styled(Wrapper)({
    height      : '11px',
    margin      : '-5px 0',
    borderTop   : '5px solid rgba(255, 255, 255, 0)',
    borderBottom: '5px solid rgba(255, 255, 255, 0)',
    cursor      : 'row-resize',
    width       : '100%',

    $next: {
        ':hover': {
            borderTop   : '5px solid rgba(0, 0, 0, 0.5)',
            borderBottom: '5px solid rgba(0, 0, 0, 0.5)',
        },

        '.disabled'      : {
            cursor: 'not-allowed',
        },
        '.disabled:hover': {
            borderColor: 'transparent',
        },
    },
});

const VerticalWrapper = styled(Wrapper)({
    width      : '11px',
    margin     : '0 -5px',
    borderLeft : '5px solid rgba(255, 255, 255, 0)',
    borderRight: '5px solid rgba(255, 255, 255, 0)',
    cursor     : 'col-resize',

    $next: {
        ':hover'         : {
            borderLeft : '5px solid rgba(0, 0, 0, 0.5)',
            borderRight: '5px solid rgba(0, 0, 0, 0.5)',
        },
        '.disabled'      : {
            cursor: 'not-allowed',
        },
        '.disabled:hover': {
            borderColor: 'transparent',
        },
    },
});

export interface ResizerProps {
    className?: string
    style?: React.CSSProperties
    index?: number
    split?: 'vertical' | 'horizontal'
    onClick?: Function
    onDoubleClick?: Function
    onMouseDown?: Function
    onTouchEnd?: Function
    onTouchStart?: Function
}

@hot(module)
export default class Resizer extends Component<ResizerProps> {
    resizer: any;

    render() {
        const {
                  className,
                  style,
                  index,
                  split         = 'vertical',
                  onClick       = () => {},
                  onDoubleClick = () => {},
                  onMouseDown   = () => {},
                  onTouchEnd    = () => {},
                  onTouchStart  = () => {},
              } = this.props;

        const props = {
            className,
            style,
            ref             : _ => (this.resizer = _),
            'data-attribute': split,
            'data-type'     : 'Resizer',
            onMouseDown     : event => {
                onMouseDown(event, index)
            },
            onTouchStart    : event => {
                event.preventDefault();
                onTouchStart(event, index);
            },
            onTouchEnd      : event => {
                event.preventDefault();
                onTouchEnd(event, index);
            },
            onClick         : event => {
                if ( onClick ) {
                    event.preventDefault();
                    onClick(event, index);
                }
            },
            onDoubleClick   : event => {
                if ( onDoubleClick ) {
                    event.preventDefault();
                    onDoubleClick(event, index);
                }
            },
        };

        return split === 'vertical' ? (
            <VerticalWrapper {...props} />
        ) : (
                   <HorizontalWrapper {...props} />
               );
    }
}

