let loaded = false;

export async function loadStyling() {
    if ( loaded ) return;
    loaded = true;
    return import(
        /* webpackChunkName: "phpdoc.style" */
        /* webpackPrefetch: true */
        './styling/codex.phpdoc.scss');
}
