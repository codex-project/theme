import merge from 'webpack-merge';
import webpack, { Configuration, DefinePlugin } from 'webpack';
import * as path from 'path';
import * as webpackConfig from '../webpack.config';

export function resolve(...p) {
    return path.resolve(__dirname, '..', ...p);
}

module.exports = (baseConfig: Configuration, env, defaultConfig: Configuration) => {
    let { chain, addHMR, addPluginEntry } = webpackConfig;
    addHMR(chain);

    chain.module.rule('ts').include.add(resolve('src/stories'));
    chain.entry('storybook').merge(defaultConfig.entry as any);
    let hotClient = defaultConfig.entry[ (defaultConfig.entry as any).length - 1 ];
    chain.entry('core').prepend(hotClient);
    chain.entry('phpdoc').prepend(hotClient);
    chain.output.path(defaultConfig.output.path);
    chain.output.publicPath('');
    const config        = chain.toConfig();
    config.optimization = defaultConfig.optimization;
    config.plugins      = defaultConfig.plugins;
    let values          = chain.plugins.get('define').values();
    config.plugins.push(new DefinePlugin(values[ 2 ][ 0 ]));

    return config;
};
declare const defConf: any;
declare const HandleCSSLoader: any;
declare const buildBaseConfig: any;
declare const stylus: any;
declare const projectRoot: any;
const old      = (baseConfig, env) => {

    const config = defConf.createDefaultWebpackConfig(baseConfig, env); // @storybook/core
    // const config = genDefaultConfig(__dirname, env); // @storybook/react

    const styleModuleLoaders = new HandleCSSLoader({
        styleLoader: 'style-loader',
        sourceMap  : true,
        postcss    : {
            plugins: [
                // require('precss'),
                require('autoprefixer'),
            ],
        },
        cssLoader  : 'css-loader?importLoaders=1',
        cssModules : true,
        minimize   : false,
        extract    : false,
    });
    const styleLoaders       = new HandleCSSLoader({
        styleLoader: 'style-loader',
        sourceMap  : true,
        postcss    : {
            plugins: [
                // require('precss'),
                require('autoprefixer'),
            ],
        },
        cssLoader  : 'css-loader?importLoaders=1',
        cssModules : false,
        minimize   : false,
        extract    : false,
    });


    config.module.rules = config.module.rules.filter(rule => ! rule.test.test('.css'));
    config.plugins.forEach(plugin => {
        if ( plugin.constructor.name === 'HtmlWebpackPlugin' ) {
            plugin.options.chunksSortMode = 'none';
        }
    });
    // const lessToJs = require('less-vars-to-js');
    // const themeVariables = lessToJs(readFileSync(resolve('src/.less/antd.variables.less'), 'utf8'));
    const conf = merge(config, {
        resolve      : buildBaseConfig().resolve,
        // {
        // mainFields: ['module', 'browser', 'main'],
        // extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.styl', '.mjs', '.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.jsx'],
        // modules   : [
        //     resolve('src'),
        //     resolve('node_modules')
        // ],
        // alias     : {
        //     src: resolve('src'),
        //
        //     api   : resolve('src/logic/api/index.ts'),
        //     ioc   : resolve('src/logic/ioc/index.ts'),
        //     router: resolve('src/logic/router/index.tsx'),
        //     stores: resolve('src/logic/stores/index.ts'),
        //
        //     decorators: resolve('src/decorators.tsx'),
        //     interfaces: resolve('src/interfaces.ts'),
        //     utils     : resolve('src/utils'),
        //
        //     layouts: resolve('src/layouts'),
        //     assets : resolve('src/assets'),
        //     views  : resolve('src/views'),
        //     '@'    : resolve('src/components'),
        //
        //     '../../theme.config$': resolve('src/semantic/theme.config')
        //     // interfaces: resolve('src/core/interfaces.ts'),
        //     // decorators: resolve('src/core/scripts/decorators.ts'),
        //     //
        //     // variables: resolve('src/themes/quasar.variables.styl'),
        //     //
        //     // codex         : resolve('src/core'),
        //     // 'vue$'       : 'vue/dist/vue.esm.js',
        //     // 'vuex$'      : 'vuex/dist/vuex.esm.js',
        //     // 'vue-router$': 'vue-router/dist/vue-router.esm.js'
        // }
        // },
        target       : 'web',
        resolveLoader: {
            modules: [ resolve('node_modules'), resolve('src') ],
            alias  : {
                'scss-vars': 'sass-vars-to-js-loader',
            },
        },
        plugins      : [
            new webpack.DefinePlugin({
                'process.env': 'development',
                'DEV'        : true,
                'PROD'       : false,
                'ASYNC_START': true,
                'ASSETSPATH' : resolve('src/assets'),
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    context: resolve('src'),
                },
                stylus : {
                    preferPathResolver: 'webpack',
                    default           : {
                        preferPathResolver: 'webpack',
                        use               : [ require('nib')() ],
                        define            : {
                            url: stylus.url({
                                paths: [
                                    resolve('src'),
                                ],
                            }),
                        },
                    },
                },
            }),
        ],
        module       : {
            rules: [

                {
                    test   : /stories\/.*\.tsx?$/,
                    loaders: [
                        {
                            loader : require.resolve('@storybook/addon-storysource/loader'),
                            options: { parser: 'typescript' },
                        },
                    ],
                    enforce: 'pre',
                },

                styleLoaders.css([ /\.css$/, /\.mod\.css$/ ]),
                styleLoaders.less([ /\.less$/, /\.mod\.less$/ ], {
                    javascriptEnabled: true,
                    modifyVars       : {},
                }),
                styleLoaders.sass([ /\.sass$/, /\.mod\.sass$/ ]),
                styleLoaders.scss([ /\.scss$/, /\.mod\.scss$/ ]),
                styleLoaders.styl([ /\.styl$/, /\.mod\.styl$/ ]),
                styleLoaders.stylus([ /\.stylus$/, /\.mod\.stylus$/ ]),

                styleModuleLoaders.css(/\.mod\.css$/),
                styleModuleLoaders.less(/\.mod\.less$/),
                styleModuleLoaders.sass(/\.mod\.sass$/),
                styleModuleLoaders.scss(/\.mod\.scss$/),
                styleModuleLoaders.styl(/\.mod\.styl$/),
                styleModuleLoaders.stylus(/\.mod\.stylus$/),
                {
                    test   : /\.(ts|tsx)$/,
                    include: projectRoot,
                    use    : [
                        {
                            loader : 'babel-loader',
                            options: {
                                'presets': [
                                    // [ 'latest', { 'es2015': { 'modules': false } } ],
                                    'env',
                                    'react-app',
                                ],
                                'plugins': [
                                    'react-hot-loader/babel',
                                ],
                            },
                        },
                        {
                            loader : require.resolve('ts-loader'),
                            options: {
                                // disable type checker - we will use it in fork plugin
                                transpileOnly  : true,
                                compilerOptions: {
                                    module: 'esnext',
                                    target: 'es6',
                                },
                            },
                        },
                        {
                            loader: require.resolve('react-docgen-typescript-loader'),
                        },
                    ],
                },
            ],
        },
    });
    // config.resolveLoader = {
    //     modules: [resolve('node_modules'), resolve('src')]
    // };
    // config.resolve.modules.push(
    //     resolve('src'),
    //     resolve('node_modules')
    // );
    // config.resolve.alias = {
    //     ...config.resolve.alias,
    //     src: resolve('src'),
    //
    //     api   : resolve('src/logic/api/index.ts'),
    //     ioc   : resolve('src/logic/ioc/index.ts'),
    //     stores: resolve('src/logic/stores/index.ts'),
    //
    //     decorators: resolve('src/decorators.tsx'),
    //     interfaces: resolve('src/interfaces.ts'),
    //     utils     : resolve('src/utils'),
    //
    //     layouts: resolve('src/layouts'),
    //     assets : resolve('src/assets'),
    //     '@'    : resolve('src/components')
    // };
    // config.module.rules.push();
    //
    // We ship a few polyfills by default:
    // require.resolve('babel-polyfill'),
    //     require.resolve('./utils/polyfills'),
    //     // Include an alternative client for WebpackDevServer. A client's job is to
    //     // connect to WebpackDevServer by a socket and get notified about changes.
    //     // When you save a file, the client will either apply hot updates (in case
    //     // of CSS changes), or refresh the page (in case of JS changes). When you
    //     // make a syntax error, this client will display a syntax error overlay.
    //     // Note: instead of the default WebpackDevServer client, we use a custom one
    //     // to bring better experience for Create React App users. You can replace
    //     // the line below with these two lines if you prefer the stock client:
    //     // require.resolve('webpack-dev-server/client') + '?/',
    //     // require.resolve('webpack/hot/dev-server'),
    //     'react-hot-loader/patch',
    //     //
    //     `webpack-dev-server/client?http://localhost:${env.config.port}`,
    //     'webpack/hot/only-dev-server',

    // config.resolve.extensions.push('.ts', '.tsx');

    // let preview = {
    //     polyfills: conf.entry.preview.shift(),
    //     globals  : conf.entry.preview.shift(),
    //     hot      : conf.entry.preview.shift(),
    //     config   : conf.entry.preview.shift()
    // };
    //
    // conf.entry.preview = [
    //     require.resolve('babel-polyfill'),
    //     require.resolve('../build/utils/polyfills'),
    //     preview.polyfills,
    //     preview.globals,
    //     preview.hot,
    //     'react-hot-loader/patch',
    //     `webpack-dev-server/client?http://localhost:6006`,
    //     'webpack/hot/only-dev-server',
    //     preview.config
    // ];

    conf.entry.manager.unshift(require.resolve('babel-polyfill'));
    // conf.entry.preview.unshift(require.resolve('babel-polyfill'))
    return conf;
};
