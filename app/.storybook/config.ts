import 'reflect-metadata';
import * as storybook from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { app } from '@codex/core';
import PhpdocPlugin from '@codex/phpdoc';
import React from 'react';

function loadStories() {
    app.plugin(new PhpdocPlugin({}));
    app.register({
        debug: true,
        cache: false,
    }).then(() => {
        app.hooks.boot.call(app);
    });
    require('../src/stories');
}

storybook.addDecorator(withOptions({
    /**
     * name to display in the top left corner
     * @type {String}
     */
    name              : 'Codex',
    /**
     * URL for name in top left corner to link to
     * @type {String}
     */
    url               : '#',
    /**
     * show story component as full screen
     * @type {Boolean}
     */
    goFullScreen      : false,
    /**
     * display panel that shows a list of stories
     * @type {Boolean}
     */
    /**
     * display panel that shows addon configurations
     * @type {Boolean}
     */
    /**
     * display floating search box to search through stories
     * @type {Boolean}
     */
    showSearchBox     : false,
    /**
     * show addon panel as a vertical panel on the right
     * @type {Boolean}
     */
    /**
     * sorts stories
     * @type {Boolean}
     */
    sortStoriesByKind : false,
    /**
     * regex for finding the hierarchy separator
     * @example:
     *   null - turn off hierarchy
     *   /\// - split by `/`
     *   /\./ - split by `.`
     *   /\/|\./ - split by `/` or `.`
     * @type {Regex}
     */
    hierarchySeparator: null,
    addonPanelInRight : false,
    /**
     * regex for finding the hierarchy root separator
     * @example:
     *   null - turn off mulitple hierarchy roots
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    /**
     * sidebar tree animations
     * @type {Boolean}
     */
    /**
     * id to select an addon panel
     * @type {String}
     */
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
}));
storybook.addDecorator(withInfo);
storybook.addDecorator(withKnobs);
storybook.addParameters({
    info: {
        inline        : false,
        header        : true,
        source        : true,
        TableComponent: (props) => React.createElement('div'),
        styles        : {
            button        : {
                base    : {
                    fontFamily: 'sans-serif',
                    fontSize  : '12px',
                    display   : 'block',
                    position  : 'fixed',
                    border    : 'none',
                    background: '#28c',
                    color     : '#fff',
                    padding   : '5px 15px',
                    cursor    : 'pointer',
                },
                topRight: {
                    top         : 0,
                    right       : 0,
                    borderRadius: '0 0 0 5px',
                },
            },
            info          : {
                position  : 'fixed',
                background: 'white',
                // top: 0,
                bottom    : 0,
                left      : 0,
                right     : 0,
                padding   : '40px 0px',
                overflow  : 'auto',
                zIndex    : 99999,
            },
            children      : {
                position: 'relative',
                zIndex  : 0,
            },
            infoBody      : {
                // ...baseFonts,
                fontWeight     : 300,
                lineHeight     : 1.45,
                fontSize       : '15px',
                border         : '1px solid #eee',
                padding        : '20px 40px 40px',
                borderRadius   : '2px',
                backgroundColor: '#fff',
                // marginTop      : '100px',
                // position       : 'absolute',
                left           : 0,
                right          : 0,
                bottom         : 0,
                height         : '20%',
                marginBottom   : '20px',
            },
            infoContent   : {
                marginBottom: 0,
            },
            infoStory     : {},
            jsxInfoContent: {
                borderTop: '1px solid #eee',
                margin   : '20px 0 0 0',
            },
            header        : {
                h1  : {
                    margin  : 0,
                    padding : 0,
                    fontSize: '15px',
                },
                h2  : {
                    margin    : '0 0 10px 0',
                    padding   : 0,
                    fontWeight: 400,
                    fontSize  : '12px',
                },
                body: {
                    borderBottom: '1px solid #eee',
                    paddingTop  : 10,
                    marginBottom: 10,
                },

                blockquote: {
                    background: 'rgba(0,0,0,0.6)',
                    padding   : '10px',
                    borderLeft: '3px solid grey',
                },
            },
            source        : {
                h1: {
                    margin      : '20px 0 0 0',
                    padding     : '0 0 5px 0',
                    fontSize    : '15px',
                    borderBottom: '1px solid #EEE',
                },
            },
            propTableHead : {
                margin: '20px 0 0 0',
            },
        },
    },
});
storybook.configure(loadStories, module);

// import '../src/stories/foundation.scss';
// import '../src/components/menu/menu.scss';
// import '../src/styles/stylesheet.scss';
//
// require('../src/.less/antd.less');
// require('../src/styles/stylesheet.scss');
