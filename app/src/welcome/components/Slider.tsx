import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Hot } from 'codex_core';
import { Carousel as BaseCarousel, Icon } from 'antd';
import MediaQuery, { MediaQueryFeatures } from 'react-responsive'
import styled from 'styled-components';
import SlickSlider from 'react-slick'
import { CarouselProps } from 'antd/lib/carousel';
import classNames from 'classnames';

const log = require('debug')('components:Slider')

const arrowSize = 20;

//region:Styled Components
const Carousel = styled(BaseCarousel)`
height: calc(100vh - 60px);
margin-top: -1px;
.slick-slide {
    text-align : center;
    height     :  calc(100vh - 60px) !important; 
    background :  #2b4956;
    overflow   :  hidden;
}
.slick-dots { bottom: 25px !important;}
.slick-dots li button { height: 15px !important;}
.slick-arrow {
    // font-size: ${arrowSize};
    // line-height: ${arrowSize};
    // height: ${arrowSize};
    // width: ${arrowSize};
    // color: #fff;
    // &.slick-next{
    // right: 0 !important;;
    // }
}
`

const Arrow     = styled.button.attrs({ className: 'c-slider c-slider-arrow' })`
    font-size: ${arrowSize}px !important;
    line-height: ${arrowSize}px !important;
    border-radius: ${arrowSize}px !important;
    height: ${arrowSize * 2}px !important;
    width: ${arrowSize * 2}px !important;
    background-color: rgba(0, 0, 0, 0.45) !important;
    color: #ffffff !important;
     z-index: 10;
    &:before { content: none !important;}
    &:hover {
        background-color: rgba(0, 0, 0, 0.25) !important;
        color: #ffffff !important;        
    }
`
const NextArrow = styled(Arrow)`
    right: 15px !important;
`
const PrevArrow = styled(Arrow)`
    left: 15px !important;
`


//endregion


export interface BaseSliderProps {
    widths?: number[]
    children?: ((width: number) => React.ReactNode) | any
}

export type SliderProps = BaseSliderProps & CarouselProps;

export type ProcessedWidthsData = Array<{
    width: number,
    mediaQuery: MediaQueryFeatures
}>

/**
 * Slider component
 */
@Hot(module)
@observer
export class Slider extends Component<SliderProps> {
    static displayName: string                = 'Slider'
    static defaultProps: Partial<SliderProps> = {}

    carousel: BaseCarousel;
    innerRef: any;

    get innerSlider(): SlickSlider { return this.innerRef.innerSlider }

    render() {
        window[ 'slider' ]                = this;
        let { children, widths, ...rest } = this.props
        let widthsData                    = this.getProcessedWidths();
        let slides                        = widthsData.map((data, index) => {
            let slides = children(data.width);
            if ( Array.isArray(slides) ) {
                slides = slides.map((slide, sindex) => React.cloneElement(slide, { key: sindex }));
            }
            return (
                <MediaQuery key={index} {...data.mediaQuery}>
                    <Carousel
                        className={classNames('c-slider')}
                        autoplay={true}
                        infinite={true}
                        dots={true}
                        arrows={true}
                        swipe={true}
                        autoplaySpeed={7000}
                        speed={500}
                        fade={true}
                        lazyLoad={true}
                        centerMode={true}
                        centerPadding={0}
                        draggable={true}
                        pauseOnHover={true}
                        ref={ref => this.carousel = ref as any}
                        innerRef={innerRef => this.innerRef = innerRef}
                        nextArrow={<NextArrow><Icon type="step-forward"/></NextArrow>}
                        prevArrow={<PrevArrow><Icon type="step-backward"/></PrevArrow>}
                        {...rest}
                    >
                        {slides}
                    </Carousel>
                </MediaQuery>
            )
        })

        return slides
    }


    getProcessedWidths() {
        const { widths, children }      = this.props;
        let widthsAsc                   = [].concat(widths).sort((a, b) => a - b);
        let widthsDesc                  = [].concat(widths).sort((a, b) => b - a);
        let result: ProcessedWidthsData = [];
        let len                         = widthsAsc.length;
        let prevWidth;
        widthsAsc.forEach((width, index) => {
            let isLast = index === len - 1;
            result.push({
                width,
                mediaQuery: {
                    minWidth: prevWidth,
                    maxWidth: isLast ? undefined : width
                }
            })
            prevWidth = width;
        })

        return result
    }

}
