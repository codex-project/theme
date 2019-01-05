import { resolve as resolvePath } from 'path';
import { BabelLoaderOptions, Chain, ForkTSCheckerOptions } from './webpack/chain';
import { AntdScssThemePlugin } from './webpack/antd-scss-theme-plugin';
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
import { InitBaseOptions } from './webpack/chain';
import { merge } from 'lodash';

export interface WebpackAppPluginConfigOptions extends Partial<InitBaseOptions> {
    cwd?: string
    srcPath?: string
    devPath?: string
    distPath?: string
    cache?: boolean
}

export default function (options: WebpackAppPluginConfigOptions = {}) {
    options = merge({
        cwd     : process.cwd(),
        mode    : process.env.NODE_ENV || 'development',
        srcPath : 'src',
        devPath : 'dev',
        distPath: 'dist',
        cache   : true,
    }, options);

    const resolve                = (...parts: string[]) => resolvePath(options.cwd, ...parts);
    const { cache } = options;
    const chain                  = new Chain({
        mode     : options.mode,
        sourceDir: options.sourceDir ? resolvePath(options.sourceDir) : resolve(options.srcPath),
        outputDir: options.outputDir ? resolvePath(options.outputDir) : resolve(options.mode === 'development' ? options.devPath : options.distPath),
    });
    const { isDev, isProd }      = chain;


    // chain.entry('app').add(chain.srcPath('index.tsx'));

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
        'heading'            : chain.srcPath('styling/heading.less'),
        '../../theme.config$': chain.srcPath('styling/theme.config'),
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

    chain.when(isProd, chain => {

        chain.optimization
            .minimize(true)
            .minimizer('terser')
            .use(TerserPlugin, [ <TerserPlugin.TerserPluginOptions>{
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
            } ]).end()
            .splitChunks({
                chunks: 'all',
                name  : true,
            })
            .namedChunks(true)
            .namedModules(true)
            .runtimeChunk(true)
        ;


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

    function addAnalyzerPlugins(chain, when: boolean = true) {
        chain.when(when, chain => chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [ <BundleAnalyzerPlugin.Options>{
            analyzerMode  : 'static',
            openAnalyzer  : false,
            reportFilename: 'bundle-analyzer.html',
        } ]));
        // chain.when(when, chain => chain.plugin('bundle-visualizer').use(VisualizerPlugin, [ { filename: 'bundle-visualizer.html' } ]));

    }

    chain.onToConfig(config => {

        AntdScssThemePlugin.SCSS_THEME_PATH = chain.srcPath('styling/antd/theme.scss');
        let antdScss                        = AntdScssThemePlugin.themify('sass-loader');
        let antdLess                        = AntdScssThemePlugin.themify('less-loader');
        config.module.rules.push(...[ {
            test   : /\.module.css$/,
            include: chain.srcPath(),
            use    : [
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

    return chain;
}
