let loaded = false;

export async function loadStyling() {
    if ( loaded ) return;
    loaded = true;
    return import(
        /* webpackChunkName: "comments.style" */
        /* webpackPrefetch: true */
        './styling/codex.comments.scss');
}
