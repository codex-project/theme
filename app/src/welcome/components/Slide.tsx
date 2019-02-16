import React, { Component } from 'react';
import { observer } from 'mobx-react';
//@ts-ignore TS2307
import { Hot } from 'codex_core';
import classNames from 'classnames';
import styled from 'styled-components';

const log = require('debug')('components:Slider')

//region:Styled Components
const Inner               = styled.div`
    height: calc(100vh - 60px) !important;
    position: relative;
`
const BaseContent         = styled.div`
position: absolute;
height: 25%;
width: 50%;
background-color: rgba(15,15,15,0.4);
color: white;
padding: 10px;
p { 
font-size: 1.5rem; 
text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
margin: 0; 
}
`
const ContentTopCenter    = BaseContent.extend`top: 25%;left: 25%;`
const ContentBottomCenter = BaseContent.extend`bottom: 25%;left: 25%;`
const ContentTopRight     = BaseContent.extend`top: 5%;right: 5%;`
const ContentTopLeft      = BaseContent.extend`top: 5%;left: 5%;`
const ContentBottomLeft   = BaseContent.extend`bottom: 5%;left: 5%;`
const ContentBottomRight  = BaseContent.extend`bottom: 5%;right: 5%;`
const Content             = (props: { position?: SlideContentPosition, height?: number | string, width?: number | string, style?: React.CSSProperties }) => {
    let Component                  = ContentTopCenter;
    let style: React.CSSProperties = props.style || {}
    style.height                   = props.height
    style.width                    = props.width
    if ( props.position ) {
        let pos = props.position;
        if ( pos === 'top-center' ) Component = ContentTopCenter
        if ( pos === 'bottom-center' ) Component = ContentBottomCenter
        if ( pos === 'top-right' ) Component = ContentTopRight
        if ( pos === 'top-left' ) Component = ContentTopLeft
        if ( pos === 'bottom-left' ) Component = ContentBottomLeft
        if ( pos === 'bottom-right' ) Component = ContentBottomRight
    }
    return <Component {...props} style={style}/>
}

//endregion

export type SlideContentPosition = 'top-center' | 'bottom-center' | 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'

export interface SlideProps {
    style?: React.CSSProperties
    className?: string
    img?: string
}


/**
 * Slider component
 */
@Hot(module)
@observer
export class Slide extends Component<SlideProps> {
    static Content: typeof Content           = Content
    static displayName: string               = 'Slide'
    static defaultProps: Partial<SlideProps> = {}

    render() {
        const { img, style, className, children } = this.props;
        return (
            <div className={classNames(className)}
                 style={{
                     ...style,
                     ...{ backgroundImage: `url(${img})`, backgroundPosition: 'top center', backgroundSize: '100%', backgroundRepeat: 'no-repeat' }
                 }}>
                <Inner>
                    {children}
                </Inner>
            </div>
        )
    }

}
