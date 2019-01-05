
export async function loadApp(){
    let app = await import(/* webpackChunkName: "site.index" */'./index');
    return app;
}
