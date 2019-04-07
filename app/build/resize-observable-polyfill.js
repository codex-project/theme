import ResizeObserver from 'resize-observer-polyfill';

if(window['ResizeObserver'] === undefined){
    window['ResizeObserver'] = ResizeObserver
}
