import { Application, BasePlugin } from '@codex/core';
import { loadStyling } from './loadStyling';

const log = require('debug')('comments');


const name = 'comments';
export default class CommentsPlugin extends BasePlugin {
    name = name;

    public install(app: Application) {
        loadStyling();
        // app.hooks.booted.tap(name, app => {
            // app.store.hooks.fetched.tap(name, result => {
            //     log('fetched', 'enabled', result.document.comments.enabled, 'driver', result.document.comments.driver);
            //     if ( ! result.document || ! result.document.comments || ! result.document.comments.enabled ) {
            //         return;
            //     }
            //     if ( result.document.comments.driver === 'disqus' ) {
            //         const { html, script, style } = result.document.comments;
            //         log('fetched', { html, script, style });
            //         if ( html ) {
            //             app.store.document.content += html;
            //         }
            //         if ( script ) {
            //             eval(script);
            //         }
            //     }
            // });
        // });
    }

    public register(): Promise<any> {
        return undefined;
    }

}
