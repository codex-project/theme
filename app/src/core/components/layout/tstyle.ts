import { CSS, styled } from 'typestyled-components';

let v;
export let variables         = v = {
    layoutHeaderHeight: 64,
};
export let LayoutHeader: CSS = {
    lineHeight    : v.layoutHeaderHeight,
    display       : 'flex',
    justifyContent: 'space-around',
};
export let LayoutHeaderMenu: CSS = {
    lineHeight    : v.layoutHeaderHeight,
}
