let loaded = false;

export async function loadStyling() {
    if ( loaded ) return;
    loaded = true;
    return import(/* webpackChunkName: "phpdoc.style" */'./styling/codex.phpdoc.scss');
}
