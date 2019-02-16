import React from 'react';
import { colors as material } from 'codex_core';
import { color } from 'csx';
import { ThemeProvider as BaseThemeProvider } from 'styled-components';

const log                       = require('debug')('welcome:components:theme')
export const themeColors        = {
    primary: '#FF5722',
    darkBg : material.blueGrey8,
    darkFg : material.blueGrey2,
    lightBg: '#ffffff',
    lightFg: material.blueGrey7
}
export const createSectionTheme = (name, fg, bg) => ({
    name,fg,bg,
    fontFamilyHeader   : `'Raleway', "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    container          : { background: bg, color: fg },
    sectionTitleDivider: { borderColor: fg },
    sectionTitle       : { color: fg },
    sectionDivider     : { borderTop: '1px inset ' + fg },
    featureHeading     : { color: fg },
    featureImage       : { border: '1px solid ' + color(bg).lighten('10%').toHexString() },
    blockquote         : { borderColor: fg, background: color(bg).lighten('10%').toHexString(), headerColor: fg }
})
export const sectionThemes      = {
    dark : createSectionTheme('dark', themeColors.darkFg, themeColors.darkBg),
    light: createSectionTheme('light', themeColors.lightFg, themeColors.lightBg)
}
export type SectionThemeType = 'dark' | 'light'
export const SectionTheme = (props: { theme: SectionThemeType, children?: any }) => <BaseThemeProvider theme={sectionThemes[ props.theme ]} children={props.children}/>

window[ 'csxcolor' ] = color;
