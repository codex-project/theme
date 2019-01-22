import { join, resolve } from 'path';
import * as dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import FriendlyErrorsPlugin, { Options as FriendlyErrorsOptions } from 'friendly-errors-webpack-plugin';
import BarPlugin, { Options as BarOptions } from 'webpackbar';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import { BabelLoaderOptions, Chain } from './build/chain';
import AntdScssThemePlugin from './build/antd-scss-theme-plugin';
import { AssetPathSubstitutionPlugin, AssetPathSubstitutionPluginOptions } from './build/AssetPathSubstitutionPlugin';
import { Options as TypescriptLoaderOptions } from 'ts-loader';
import tsImport from 'ts-import-plugin';
import { colorPaletteFunction, colorPaletteFunctionSignature } from './build/antdScssColorPalette';

const chain             = new Chain({
    mode     : process.env.NODE_ENV as any,
    sourceDir: resolve(__dirname, 'src'),
    outputDir: resolve(__dirname, process.env.NODE_ENV === 'development' ? 'dev' : 'dist'),
});
const { isDev, isProd } = chain;
const cache             = isDev;
const _assetPath        = isDev ? 'vendor' : 'vendor/codex_[entrypoint]';
const assetPath         = (...parts: string[]) => join(_assetPath, ...parts);
const rootPath          = (...parts: string[]) => resolve(__dirname, '..', ...parts);
const tsconfig          = resolve(__dirname, 'tsconfig.webpack.json');

chain.entry('core').add(chain.srcPath('core/index.ts'));
// chain.entry('phpdoc').add(chain.srcPath('phpdoc/index.ts'));
chain.entry('site').add(chain.srcPath('site/entry.ts'));

chain.when(isProd, chain => chain.plugin('path-substitution').use(AssetPathSubstitutionPlugin, [ <AssetPathSubstitutionPluginOptions>{
    defaultEntryPoint: 'site',
} ]));

chain
    .target('web')
    .cache(cache)
    .devtool(isDev ? 'cheap-module-source-map' : false);

chain.output
    .path(chain.outPath())
    .pathinfo(isDev)
    .filename(assetPath('js/[name].js'))
    .chunkFilename(assetPath('js/chunk.[name].js'))
    .publicPath('/')
    .library([ 'codex', '[name]' ] as any)
    .libraryTarget('window');

chain.externals({
    '@codex/core'  : [ 'codex', 'core' ],
    // '@codex/phpdoc': [ 'codex', 'phpdoc' ],
});
chain.resolve
    .symlinks(true)
    .extensions.merge([ '.js', '.vue', '.json', '.web.ts', '.ts', '.web.tsx', '.tsx', '.styl', '.less', '.scss', '.stylus', '.css', '.mjs', '.web.js', '.json', '.web.jsx', '.jsx' ]).end()
    .mainFields.merge([ 'module', 'browser', 'main' ]).end() // 'jsnext:main',
    .mainFiles.merge([ 'index', 'index.ts', 'index.tsx' ]).end()
    .modules.merge([ 'node_modules', chain.srcPath('core') ]).end()
    .alias.merge({
    'lodash-es$'         : 'lodash',
    'async$'             : 'neo-async',
    '@ant-design/icons'  : 'purched-antd-icons', /** @see https://github.com/ant-design/ant-design/issues/12011 */
    // '@codex/phpdoc'      : chain.srcPath('phpdoc'),
    '@codex/core'        : chain.srcPath('core'),
    // 'tapable'            : chain.srcPath('tapable/lib'),
    'heading'            : chain.srcPath('core/styling/heading.less'),
    '../../theme.config$': chain.srcPath('core/styling/theme.config'),
    './core/index.less$' : chain.srcPath('core/styling/antd/core.less'),
}).end();

chain.resolveLoader
    .modules.merge([ 'node_modules' ]).end()
    .extensions.merge([ '.js', '.json', '.ts' ]).end();

chain.module.set('strictExportPresence', true);

chain.resolve.alias.set('@codex/api', rootPath('packages/api/src'));
chain.module.rule('ts').include.add(rootPath('packages/api/src'));

const babelImportPlugins = [
    [ 'import', { libraryName: 'antd', style: true }, 'import-antd' ],
    [ 'import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'import-lodash' ],
    [ 'import', { libraryName: 'lodash-es', libraryDirectory: '', camel2DashComponentName: false }, 'import-lodash-es' ],
];
chain.module.rule('ts')
    .test(/\.(ts|tsx)$/)
    .include.add(chain.srcPath()).end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(<BabelLoaderOptions>{
        babelrc: false,
        presets: [
            [ 'react-app' ],
        ],
        plugins: [
            ...babelImportPlugins,
            'jsx-control-statements',
            [ 'react-css-modules', {
                'context'               : chain.srcPath(),
                'filetypes'             : {
                    '.mscss': {
                        'syntax' : 'postcss-scss',
                        'plugins': [
                            'postcss-nested',
                        ],
                    },
                },
                'handleMissingStyleName': 'warn',
                'generateScopedName'    : '[name]__[local]',
            } ],
        ].filter(Boolean),
    }).end()
    .use('ts-loader')
    .loader('ts-loader')
    .options(<Partial<TypescriptLoaderOptions>>{
        transpileOnly        : true,
        configFile           : tsconfig,
        compilerOptions      : { module: 'es2015' as any, target: 'es5' as any },
        happyPackMode        : true,
        getCustomTransformers: () => ({
            before: [
                tsImport([
                    { libraryName: 'antd', style: true },
                    { libraryName: 'semantic-ui-react', libraryDirectory: (importName) => Object.keys(require('./build/semantic-data').nameLocations).includes(importName) ? join('dist/es', require('./build/semantic-data').nameLocations[ importName ]) : 'dist/es' },
                    { libraryName: 'neo-async', libraryDirectory: null, camel2DashComponentName: false },
                    { libraryName: 'lodash', libraryDirectory: null, camel2DashComponentName: false },
                    { libraryName: 'lodash-es', libraryDirectory: null, camel2DashComponentName: false },
                ]) as any,
            ],
        }),
    } as any);

chain.stats({
    warningsFilter: /export .* was not found in/,
});

chain.module.rule('babel-loader')
    .test(/\.(js|mjs|jsx)$/)
    .include.add(chain.srcPath()).end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(<BabelLoaderOptions>{
        customize       : require.resolve('babel-preset-react-app/webpack-overrides'),
        babelrc         : false,
        configFile      : false,
        presets         : [
            [ 'react-app' ],
        ],
        plugins         : [
            'jsx-control-statements',
            [ 'react-css-modules', {
                'context'               : chain.srcPath(),
                'filetypes'             : {
                    '.mscss': {
                        'syntax' : 'postcss-scss',
                        'plugins': [
                            'postcss-nested',
                        ],
                    },
                },
                'handleMissingStyleName': 'warn',
                'generateScopedName'    : '[name]__[local]',
            } ],
            ...babelImportPlugins,
        ].filter(Boolean),
        cacheDirectory  : cache,
        cacheCompression: isProd,
        compact         : isProd,
    } as any);

// chain.when(isProd, chain =>
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
        })
// );

function addAssetsLoaderForEntry(chain: Chain, entrypoint: string, path: string) {
    let assetPath = _assetPath.replace('[entrypoint]', entrypoint);
    chain.module.rule('fonts-' + entrypoint)
        .test(/\.*\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/)
        .include.add(path).end()
        .use('file-loader')
        .loader('file-loader')
        .options({
            name      : '[name].[ext]',
            // publicPath: '/' + assetPath + '/fonts/',
            outputPath: assetPath + '/fonts/',
        });
    chain.module.rule('images-' + entrypoint)
        .test(/\.*\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .include.add(path).end()
        .use('file-loader')
        .loader('file-loader')
        .options({
            name      : '[name].[ext]',
            // publicPath: '/' + assetPath + '/img/',
            outputPath: assetPath + '/img/',
        });
}

addAssetsLoaderForEntry(chain, 'core', chain.srcPath('core'));
// addAssetsLoaderForEntry(chain, 'phpdoc', chain.srcPath('phpdoc'));
addAssetsLoaderForEntry(chain, 'site', chain.srcPath('site'));


chain.node.merge({
    dgram        : 'empty',
    fs           : 'empty',
    net          : 'empty',
    tls          : 'empty',
    child_process: 'empty',
});


chain.when(isDev, chain => {
    chain.set('optimization', <webpack.Configuration['optimization']>{
        namedModules: true,
        namedChunks : true,
        runtimeChunk: true,
        splitChunks : {
            name       : true,
            cacheGroups: {
                default: false as any,
                commons: {
                    name     : 'commons',
                    chunks   : 'initial',
                    minChunks: 2,
                    minSize  : 0,
                },
            },
        },
    });
}, chain => {
    chain.set('optimization', <webpack.Configuration['optimization']>{
        namedModules: true,
        namedChunks : true,
        runtimeChunk: true,
        splitChunks : {
            name              : true,
            chunks            : 'all',
            maxInitialRequests: Infinity,
            minSize           : 0,
            cacheGroups       : {
                default: false as any,
                commons: {
                    name     : 'commons',
                    chunks   : 'initial',
                    minChunks: 2,
                    minSize  : 0,
                },
            },
        },
        minimize    : true,
        minimizer   : [
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
        ],
    });
    chain.plugin('css-extract').use(MiniCssExtractPlugin, [ {
        filename     : assetPath('css/[name].css?[hash]'),
        chunkFilename: assetPath('css/[name].chunk.css?[chunkhash]'),
    } ]);
    chain.plugin('css-optimize').use(OptimizeCssAssetsPlugin, [ <OptimizeCssAssetsPlugin.Options>{
        assetNameRegExp    : /\.css$/g,
        cssProcessor       : require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint           : true,
    } ]);
});
chain.plugin('write-file').use(WriteFilePlugin, [ { useHashIndex: false } ]);
chain.plugin('clean').use(CleanWebpackPlugin, [
    [ 'js/', 'css/', '*.hot-update.js', '*.hot-update.js.map', '*.hot-update.json', 'assets/', 'vendor/' ],
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
chain.plugin('bar').use(BarPlugin, [ <BarOptions>{
    profile   : true,
    compiledIn: true
} ]);
chain.plugin('loader-options').use(webpack.LoaderOptionsPlugin, [ { options: {} } ]);
chain.plugin('friendly-errors').use(FriendlyErrorsPlugin, [ <FriendlyErrorsOptions>{
    compilationSuccessInfo: { messages: [ 'Build success' ], notes: [] },
    onErrors              : function (severity, errors) { console.error(severity, errors); },
    clearConsole          : false,
    logLevel              : true,
    additionalFormatters  : [],
    additionalTransformers: [],
} ]);
chain.plugin('copy').use(CopyPlugin, [ [
        isProd && { from: chain.srcPath('core/assets'), to: chain.outPath('vendor/codex_core') },
        isDev && { from: chain.srcPath('core/assets'), to: chain.outPath('vendor') },

    ].filter(Boolean) ],
);
chain.plugin('html').use(HtmlPlugin, [ <HtmlPlugin.Options>{
    filename: 'index.html',
    template: chain.srcPath('site/index.html'),
    inject  : 'head',
    DEV     : isDev,
    PROD    : isProd,
    TEST    : process.env.NODE_ENV === 'test',
    ENV     : dotenv.load({ path: resolve('.env') }).parsed,
} ]);
chain.onToConfig(config => {
    AntdScssThemePlugin.SCSS_THEME_PATH = chain.srcPath('core/styling/antd/theme.scss');
    let antdScss                        = AntdScssThemePlugin.themify('sass-loader');
    let antdFastScss                    = AntdScssThemePlugin.themify('sass-loader');
    let antdLess                        = AntdScssThemePlugin.themify('less-loader');
    config.module.rules.push(...[ {
        test: /\.module.css$/,
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
            { loader: 'fast-css-loader', options: { importLoaders: 1, sourceMap: isDev } },
            isProd && { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
        ].filter(Boolean),
    }, {
        test: /\.(module\.scss|mscss)$/,
        use : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev, camelCase: false, modules: true, localIdentName: '[name]__[local]' } },
            { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
            { loader: antdScss.loader, options: { ...antdScss.options, functions: { [ colorPaletteFunctionSignature ]: colorPaletteFunction } } },
        ],
    }, {
        test   : /\.scss$/,
        exclude: [ /\.module\.scss$/, /\.mscss$/ ],
        use    : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'fast-css-loader', options: { importLoaders: 2, sourceMap: isDev, camelCase: true } },
            isProd && { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
            { loader: antdFastScss.loader, options: { ...antdFastScss.options, functions: { [ colorPaletteFunctionSignature ]: colorPaletteFunction } } },
        ].filter(Boolean),
    }, {
        test: /\.less$/,
        use : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'fast-css-loader', options: { importLoaders: 2, sourceMap: isDev } },
            isProd && { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
            { loader: antdLess.loader, options: { ...antdLess.options, ...{ javascriptEnabled: true, sourceMap: isDev } } },
        ].filter(Boolean),
    } ]);
    config.plugins.push(new AntdScssThemePlugin(AntdScssThemePlugin.SCSS_THEME_PATH));
    return config;
});

chain.performance
    .hints(false)
    .maxEntrypointSize(999999999)
    .maxAssetSize(999999999)
    .assetFilter(as => false);


export function addHMR(chain: Chain, reactHotLoader: boolean = true) {
    chain.plugin('hmr').use(webpack.HotModuleReplacementPlugin, [ {} ]);
    const modifyOptions = (o: BabelLoaderOptions) => {
        if ( reactHotLoader ) {
            o.plugins.push('react-hot-loader/babel');
        }
        let reactCssModulesIndex = o.plugins.findIndex(plugin => Array.isArray(plugin) && plugin[ 0 ] === 'react-css-modules');
        if ( reactCssModulesIndex !== - 1 ) {
            o.plugins[ reactCssModulesIndex ][ 1 ].webpackHotModuleReloading = true;
        }
        return o;
    };
    chain.module.rule('babel-loader').use('babel-loader').tap(modifyOptions);
    chain.module.rule('ts').use('babel-loader').tap(modifyOptions);
}

export function addAnalyzerPlugins(chain: Chain, when: boolean = true) {
    chain.when(when, chain => chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [ <BundleAnalyzerPlugin.Options>{
        analyzerMode  : 'static',
        openAnalyzer  : false,
        reportFilename: 'bundle-analyzer.html',
    } ]));
}

const config = chain.toConfig();

const a = 'a';
export default config;
export { chain, config };
