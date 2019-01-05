import { resolve } from 'path';
import * as dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as webpack from 'webpack';
import { HotModuleReplacementPlugin } from 'webpack';
import FriendlyErrorsPlugin, { Options as FriendlyErrorsOptions } from 'friendly-errors-webpack-plugin';
import BarPlugin, { Options as BarOptions } from 'webpackbar';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin-alt';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import { BabelLoaderOptions, Chain, ForkTSCheckerOptions } from './build/chain';
import AntdScssThemePlugin from './build/antd-scss-theme-plugin';

const rootPath          = (...parts: string[]) => resolve(__dirname, '..', '..', ...parts);
const cache             = true;
const chain             = new Chain({
    mode     : process.env.NODE_ENV as any,
    sourceDir: resolve(__dirname, 'src'),
    outputDir: resolve(__dirname, process.env.NODE_ENV === 'development' ? 'dev' : 'dist'),
});
const { isDev, isProd } = chain;

chain.entry('site').add(chain.srcPath('loadApp.ts'));
chain.entry('polyfills').add(chain.srcPath('loadPolyfills.ts'));

chain
    .target('web')
    .cache(cache)
    .devtool(isDev ? 'cheap-module-source-map' : false);

chain.output
    .path(chain.outPath())
    .pathinfo(isDev)
    .filename('js/[name].js')
    .chunkFilename('js/chunk.[name].js')
    .publicPath('/')
    .libraryTarget('umd');

chain.resolve
    .symlinks(true)
    .extensions.merge([ '.js', '.vue', '.json', '.web.ts', '.ts', '.web.tsx', '.tsx', '.styl', '.less', '.scss', '.stylus', '.css', '.mjs', '.web.js', '.json', '.web.jsx', '.jsx' ]).end()
    .mainFields.merge([ 'module', 'browser', 'main' ]).end()
    .mainFiles.merge([ 'index', 'index.ts', 'index.tsx' ]).end()
    .modules.merge([ 'node_modules', chain.srcPath() ]).end()
    .alias.merge({
    'lodash-es$'         : 'lodash',
    'lodash-es'          : 'lodash',
    '@ant-design/icons'  : 'purched-antd-icons', /** @see https://github.com/ant-design/ant-design/issues/12011 */
    '@codex/core'        : '@codex/core/src',
    '@codex/core/styling': '@codex/core/src/styling',
    'heading'            : '@codex/core/src/styling/heading.less',
    '../../theme.config$': '@codex/core/src/styling/theme.config',
}).end();

chain.resolveLoader
    .modules.merge([ 'node_modules' ]).end()
    .extensions.merge([ '.js', '.json', '.ts' ]).end();

chain.module.set('strictExportPresence', true);

const babelImportPlugins = [
    [ 'import', { libraryName: 'antd', style: true }, 'import-antd' ],
    [ 'import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'import-lodash' ],
    [ 'import', { libraryName: 'lodash-es', libraryDirectory: '', camel2DashComponentName: false }, 'import-lodash-es' ],
];

chain.module.rule('babel-loader')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include.add(chain.srcPath()).end()
    .include.add(rootPath('packages/core/src')).end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(<BabelLoaderOptions>{
        customize       : require.resolve('babel-preset-react-app/webpack-overrides'),
        babelrc         : false,
        configFile      : false,
        presets         : [
            [ 'react-app', { 'flow': false, 'typescript': true } ],
        ],
        plugins         : [
            'jsx-control-statements',
            [ 'react-css-modules', {
                'context'                  : chain.srcPath(),
                'webpackHotModuleReloading': isDev,
                'filetypes'                : {
                    '.mscss': {
                        'syntax' : 'postcss-scss',
                        'plugins': [
                            'postcss-nested',
                        ],
                    },
                },
                'handleMissingStyleName'   : 'warn',
                'generateScopedName'       : '[name]__[local]',
            } ],
            ...babelImportPlugins,
            isDev && 'react-hot-loader/babel',
        ].filter(Boolean),
        cacheDirectory  : cache,
        cacheCompression: isProd,
        compact         : isProd,
    } as any);

chain.module.rule('vendor-js')
    .test(/\.(js|mjs)$/)
    .exclude.add(/@babel(?:\/|\\{1,2})runtime/).end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(<BabelLoaderOptions>{
        babelrc         : false,
        configFile      : false,
        compact         : false,
        presets         : [ [ require.resolve('babel-preset-react-app/dependencies'), { helpers: true } ] ],
        plugins         : [
            ...babelImportPlugins,
        ],
        cacheDirectory  : cache,
        cacheCompression: isProd,
    });

chain.module.rule('fonts')
    .test(/\.*\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/)
    .include.add(chain.srcPath()).end()
    .use('file-loader')
    .loader('file-loader')
    .options({
        name      : '[name].[ext]',
        publicPath: `/fonts/`,
        outputPath: 'fonts/',
    });

chain.module.rule('images')
    .test(/\.*\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .include.add(chain.srcPath()).end()
    .use('file-loader')
    .loader('file-loader')
    .options({
        name      : '[name].[ext]',
        publicPath: `/img/`,
        outputPath: 'img/',
    });

chain.node.merge({
    dgram        : 'empty',
    fs           : 'empty',
    net          : 'empty',
    tls          : 'empty',
    child_process: 'empty',
});

chain.set('optimization', <webpack.Configuration['optimization']>{
    namedModules:true,
    namedChunks: true,
    runtimeChunk: false,
    splitChunks: {
        chunks:'all',
        name:true
    }
})
chain.when(isProd, chain => {
    chain.set('optimization', <webpack.Configuration['optimization']>{
        ...chain.get('optimization'),
        minimize:true,
        minimizer: [
            new TerserPlugin(<TerserPlugin.TerserPluginOptions>{
                terserOptions: {
                    parse   : { ecma: 8 },
                    mangle  : { safari10: true },
                    compress: {
                        ecma       : 5,
                        warnings   : false,
                        comparisons: false,
                        inline     : 2,
                    },
                    output  : {
                        ecma      : 5,
                        comments  : false,
                        ascii_only: true,
                    },
                },
                parallel     : true,
                cache        : true,
                sourceMap    : false,
            }),
        ]
    })
});
chain.plugin('write-file').use(WriteFilePlugin, [ { useHashIndex: false } ]);
chain.plugin('clean').use(CleanWebpackPlugin, [
    [ 'js/', 'css/', '*.hot-update.js', '*.hot-update.js.map', '*.hot-update.json', 'assets/' ],
    <CleanWebpackPlugin.Options>{ root: chain.outPath(), verbose: false },
]);

chain.plugin('define').use(webpack.DefinePlugin, [ {
    'process.env': {
        NODE_ENV: `"${chain.get('mode')}"`,
    },
    DEV          : isDev,
    PROD         : isProd,
    TEST         : chain.get('mode') === 'testing',
    ENV          : dotenv.load({ path: resolve('.env') }).parsed,
} ]);

chain.plugin('bar').use(BarPlugin, [ <BarOptions>{ profile: isDev, compiledIn: isDev } ]);
chain.plugin('loader-options').use(webpack.LoaderOptionsPlugin, [ { options: {} } ]);
chain.plugin('friendly-errors').use(FriendlyErrorsPlugin, [ <FriendlyErrorsOptions>{
    compilationSuccessInfo: isProd ? {} : { messages: [ 'Build success' ], notes: [] },
    onErrors              : function (severity, errors) { console.error(severity, errors); },
    clearConsole          : false,
    logLevel              : true,
} ]);
chain.plugin('fork-ts-checker').use(ForkTsCheckerWebpackPlugin, [ <ForkTSCheckerOptions>{
    async               : false,
    checkSyntacticErrors: true,
    tsconfig            : resolve(__dirname, 'tsconfig.json'),
    compilerOptions     : {
        module           : 'esnext',
        moduleResolution : 'node',
        resolveJsonModule: true,
        isolatedModules  : true,
        noEmit           : true,
        jsx              : 'preserve',
    },
    reportFiles         : [
        'src/**',
        '!**/*.json',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
    ],
    watch               : chain.srcPath(),
    silent              : true,
    formatter           : require('react-dev-utils/typescriptFormatter'),
} ]);

chain.plugin('copy').use(CopyPlugin, [ [
        { from: chain.srcPath('assets'), to: chain.outPath('assets') },
    ] ],
);

chain.plugin('html').use(HtmlPlugin, [ <HtmlPlugin.Options>{
    filename: 'index.html',
    template: 'index.html',
    inject  : 'head',
    DEV     : isDev,
    PROD    : isProd,
    TEST    : process.env.NODE_ENV === 'test',
    ENV     : dotenv.load({ path: resolve('.env') }).parsed,
} ]);


chain.when(isDev, chain => {
    chain.plugin('hmr').use(HotModuleReplacementPlugin, [ {} ]);

}, chain => {
    chain.plugin('css-extract').use(MiniCssExtractPlugin, [ {
        filename     : 'css/[name].css?[hash]',
        chunkFilename: 'css/[name].chunk.css?[chunkhash]',
    } ]);
    chain.plugin('css-optimize').use(OptimizeCssAssetsPlugin, [ <OptimizeCssAssetsPlugin.Options>{
        assetNameRegExp    : /\.css$/g,
        cssProcessor       : require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint           : true,
    } ]);
});

class Asdf {
    apply(compiler: webpack.Compiler) {
        let a          = compiler;
        const analyzer = require('webpack-bundle-analyzer/lib/analyzer.js');
        compiler.hooks.done.intercept({
            register: (tapInfo) => {
                if ( tapInfo.name !== 'webpack-bundle-analyzer' ) return tapInfo;
                console.log(tapInfo.name, a.name);
                let fn     = tapInfo.fn;
                tapInfo.fn = (stats) => {
                    let chartData    = analyzer.getViewerData(stats.toJson(), null, {
                        openBrowser   : false,
                        reportFilename: 'report.html',
                        analyzerMode  : 'static',
                        bundleDir     : null,
                        logger        : console,
                        defaultSizes  : 'gzip',
                        excludeAssets : null,
                    });
                    const findModule = (path: string) => typeof path === 'string' && path.length > 0 && stats.compilation.modules.find(module => module.resource && path.endsWith(module.resource));
                    const traverse   = (groups: any[], cb: Function, parent?: any) => groups.forEach(group => {
                        if ( group.groups ) {
                            traverse(group.groups, cb, group);
                        }
                        cb(group, parent);
                    });
                    traverse(chartData, (group, parent?) => {
                        let mod: any = findModule(group.path);
                        if ( mod ) {
                            group.module = mod;
                            if ( ! group.gzipSize ) {
                                try {
                                    let src        = Array.from<any>(mod[ '_cachedSources' ].values()).map((item: any) => item[ 'source' ][ 'source' ]()).join('');
                                    group.gzipSize = require('gzip-size').sync(src);
                                    if ( parent && (parent.gzipSize === undefined || parent.gzipSize === 0) ) {
                                        parent.gzipSize = 0;
                                    }
                                    if ( parent ) {
                                        parent.gzipSize += group.gzipSize;
                                    }
                                } catch ( e ) {}
                            }
                        }
                    }, null);
                    let mods                = [];
                    const getRootGzipGroups = (groups: any[]) => groups.forEach(group => {
                        if ( group.gzipSize ) {
                            mods.push(group);
                        } else if ( group.groups && group.groups.length > 0 ) {
                            getRootGzipGroups(group.groups);
                        }
                    });
                    getRootGzipGroups(chartData);
                    mods           = mods.sort((a, b) => a.gzipSize > b.gzipSize ? - 1 : 1);
                    const filesize = require('filesize');
                    const chalk    = require('chalk').default;
                    const ui       = require('cliui')({
                        width: process.stdout.columns,
                    });
                    ui.div(chalk.bold('Module'), chalk.bold('Stat'), chalk.bold('Gzip'));
                    mods.forEach(mod => {
                        ui.div(mod.label.split('/').shift(), filesize(mod.statSize), filesize(mod.gzipSize));
                    });
                    console.log('\n' + ui.toString() + '\n');
                    fn(stats);
                };
                return tapInfo;
            },
        });
    }
}

export function addAnalyzerPlugins(chain: Chain, when: boolean = true) {
    chain.when(when, chain => chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [ <BundleAnalyzerPlugin.Options>{
        analyzerMode  : 'static',
        openAnalyzer  : false,
        reportFilename: 'bundle-analyzer.html',
    } ]));
    // chain.when(when, chain => chain.plugin('bundle-visualizer').use(VisualizerPlugin, [ { filename: 'bundle-visualizer.html' } ]));

    chain.plugin('analyzer-checker')
        .use(Asdf, [ {} ]);
}

chain.onToConfig(config => {

    AntdScssThemePlugin.SCSS_THEME_PATH = rootPath('packages/core/src/styling/antd/theme.scss');
    // let antdScss                        = {loader:'sass-loader',options:{}};//AntdScssThemePlugin.themify('sass-loader');
    // let antdLess                        = {loader:'less-loader',options:{}};//AntdScssThemePlugin.themify('less-loader');
    let antdScss = AntdScssThemePlugin.themify('sass-loader');
    let antdLess = AntdScssThemePlugin.themify('less-loader');
    config.module.rules.push(...[ {
        test: /\.module.css$/,
        // include: chain.srcPath(),
        use : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: isDev, modules: true, localIdentName: '[name]__[local]' } },
            { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
        ],
    }, {
        test   : /\.css$/,
        exclude: [ /\.module.css$/ ],
        use    : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: isDev } },
            { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
        ],
    }, {
        test: /\.(module\.scss|mscss)$/,
        use : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev, camelCase: false, modules: true, localIdentName: '[name]__[local]' } },
            { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
            { loader: antdScss.loader, options: { ...antdScss.options, ...{} } },
        ],
    }, {
        test   : /\.scss$/,
        exclude: [ /\.module\.scss$/, /\.mscss$/ ],
        use    : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev, camelCase: false } },
            { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
            { loader: antdScss.loader, options: { ...antdScss.options, ...{} } },
        ],
    }, {
        test: /\.less$/,
        use : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev } },
            { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
            { loader: antdLess.loader, options: { ...antdLess.options, ...{ javascriptEnabled: true, sourceMap: isDev } } },
        ],
    } ]);
    config.plugins.push(new AntdScssThemePlugin(AntdScssThemePlugin.SCSS_THEME_PATH));
    return config;
});

chain.performance.hints(false).maxAssetSize(999999999).assetFilter(as => false);

const config = chain.toConfig();

const a = 'a';
export default config;
export { chain, config };
