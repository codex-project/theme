import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Hot } from 'codex_core';
import { Layout } from 'antd';
import { hideAll } from 'react-reveal/globals';
import styled from 'styled-components';
import { SectionTheme, SectionThemeType, themeColors } from './theme';

const log = require('debug')('welcome:components:section')

//region:Styled Components
const Container    = styled(Layout.Content)`
padding-top: 4rem;
padding-bottom: 4rem;
> p { font-family: ${props => props.theme.fontFamilyHeader};}
background-color: ${props => props.theme.container.background};
color: ${props => props.theme.container.color};`
const Title        = styled.h2`
text-align: center;
color: ${p => p.theme.sectionTitle.color};
&::after { 
    content: '.'; 
    font-weight: bold; 
    color: ${themeColors.primary}; 
    margin-left: 2px; 
}`
const TitleDivider = styled.hr`
width: 120px; 
border: 1px dashed ${p => p.theme.sectionTitleDivider.borderColor};`
const Divider      = styled.hr`
margin: 5rem 0; 
border-top: ${p => p.theme.sectionDivider.borderTop};`
const Content      = styled.div`
padding-top: 2rem;
padding-bottom: 4rem;
`
const Blockquote   = styled.blockquote`
border-color: ${p => p.theme.blockquote.borderColor};
background: ${p => p.theme.blockquote.background};
p {
    font-size: 1rem;
    margin: 0;
}
h4 {
    font-size: 1.3rem;
    margin: 0 0 5px 0;
    border-bottom: 1px solid #9e9e9e;
    padding-bottom: 5px;
    border-bottom-style: dashed;
    color: ${p => p.theme.blockquote.headerColor};
}`
//endregion

export interface SectionProps {
    id?: string
    theme?: SectionThemeType
    title?: string
}

/**
 * Section component
 */
@Hot(module)
@observer
export class Section extends Component<SectionProps> {
    static Container: typeof Container       = Container
    static Title: typeof Title               = Title
    static TitleDivider: typeof TitleDivider = TitleDivider
    static Content: typeof Content           = Content
    static Blockquote: typeof Blockquote     = Blockquote
    static Divider: typeof Divider           = Divider

    static displayName: string                 = 'Section'
    static defaultProps: Partial<SectionProps> = {
        theme: 'light'
    }

    render() {
        let { theme, title, children, id } = this.props;
        if ( ! id && title ) {
            id = title.toLowerCase().replace(/\s/g, '-');
        }
        return (
            <SectionTheme theme={theme}>
                <Container id={id}>
                    {title ? <header>
                        <Title>{title}</Title>
                        <TitleDivider/>
                    </header> : null}
                    {title ? <Content>{children}</Content> : children}
                </Container>
            </SectionTheme>
        )
    }

}
