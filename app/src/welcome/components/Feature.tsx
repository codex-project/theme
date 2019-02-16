import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Hot } from 'codex_core';
import styled from 'styled-components';
import Fade, { ReactRevealProps } from 'react-reveal/Fade';
import { Col } from 'antd';
import { ColSize } from 'antd/es/col';

const log = require('debug')('components:Feature')

//region:Styled Components
const Container = styled.div`
text-align: center`
const Image     = styled.img`
height: 140px; 
width: 140px;`
const Heading   = styled.h3`
margin-top: 10px;
font-weight: 300;
line-height: 1;
letter-spacing: -.05rem;
color: ${p => p.theme.fg};`
//endregion

export type FeatureColProp = ColSize & {
    xs?: number | ColSize;
    sm?: number | ColSize;
    md?: number | ColSize;
    lg?: number | ColSize;
    xl?: number | ColSize;
    xxl?: number | ColSize;
}

export interface FeatureProps {
    img?: string
    title?: string
    duration?: number
    delay?: number
    content?: React.ReactNode
    col?: FeatureColProp
    fade?: ReactRevealProps
}

/**
 * Feature component
 */
@Hot(module)
@observer
export default class Feature extends Component<FeatureProps> {
    static Heading: typeof Heading     = Heading
    static Image: typeof Image         = Image
    static Container: typeof Container = Container

    static displayName: string                 = 'Feature'
    static defaultProps: Partial<FeatureProps> = {
        duration: 1500,
        delay   : 0,
        col     : {
            xs    : 20,
            sm    : 20,
            lg    : 5,
            offset: 2
        },
        fade    : {
            bottom: true,
            wait  : 1000
        }
    }

    render() {
        const { img, title, duration, delay, content, children, col, fade } = this.props;
        return (
            <Col {...col}>
                <Fade duration={duration} delay={delay} {...fade}>
                    {content ? content :
                     <Container>
                         <Image src={img}/>
                         <Heading>{title}</Heading>
                         <p>{children}</p>
                     </Container>}
                </Fade>
            </Col>
        )
    }

}
