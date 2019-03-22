import { isAbsolute, join, resolve } from 'path';
import * as dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack, { Configuration, DevtoolModuleFilenameTemplateInfo, RuleSetRule } from 'webpack';
import FriendlyErrorsPlugin, { Options as FriendlyErrorsOptions } from 'friendly-errors-webpack-plugin';
import BarPlugin, { Options as BarOptions } from 'webpackbar';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import { BabelLoaderOptions, Chain } from './build/chain';
import AntdScssThemePlugin from './build/antd-scss-theme-plugin';
import { Options as TypescriptLoaderOptions } from 'ts-loader';
import tsImport from 'ts-import-plugin';
import { colorPaletteFunction, colorPaletteFunctionSignature } from './build/antdScssColorPalette';
import WebappPlugin from 'webapp-webpack-plugin';
import EntrypointPathPlugin from './build/EntrypointPathPlugin';
import TerserPlugin = require('terser-webpack-plugin');


const chain             = new Chain({
    mode     : process.env.NODE_ENV as any,
    sourceDir: resolve(__dirname, 'src'),
    outputDir: resolve(__dirname, process.env.NODE_ENV === 'development' ? 'dev' : 'dist'),
});
const { isDev, isProd } = chain;
const cache             = true;
const assetsByEntry     = isProd;
const _assetPath        = assetsByEntry ? 'vendor/codex_[entrypoint]' : 'vendor';
const minimize          = isProd;
const assetPath         = (...parts: string[]) => join(_assetPath, ...parts);
const rootPath          = (...parts: string[]) => resolve(__dirname, '..', ...parts);
const packagesPath      = (...parts: string[]) => resolve(__dirname, '../packages', ...parts);
const tsconfig          = resolve(__dirname, 'tsconfig.webpack.json');

//region: Helper Functions
const babelImportPlugins = [
    [ 'import', { libraryName: 'antd', style: true }, 'import-antd' ],
    [ 'import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'import-lodash' ],
    [ 'import', { libraryName: 'lodash-es', libraryDirectory: '', camel2DashComponentName: false }, 'import-lodash-es' ],
];

export function addBabelToRule(chain: Chain, ruleName: string, options: BabelLoaderOptions = {}) {
    let rule = chain.module.rule(ruleName);
    rule.use('babel-loader')
        .loader('babel-loader')
        .options(<BabelLoaderOptions>{
            babelrc       : false,
            configFile    : false,
            presets       : [
                [ 'react-app' ],
            ],
            plugins       : [
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
            cacheDirectory: cache,
            compact       : false,
            ...options,
        } as any);
}

export function addTsToRule(chain: Chain, ruleName: string, options: Partial<TypescriptLoaderOptions> = {}, babelOptions: BabelLoaderOptions = {}) {
    let rule = chain.module.rule(ruleName);
    if ( ! rule.has('babel-loader') ) {
        addBabelToRule(chain, ruleName, babelOptions);
    }
    rule
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
            ...options,
        } as any);
}

let assetLoader = isDev ? 'file-loader' : 'file-loader';

export function addAssetsLoaderForEntry(chain: Chain, name: string, path: string) {
    let assetPath = _assetPath.replace('[entrypoint]', name);
    chain.module.rule('fonts-' + name)
        .test(/\.*\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/)
        .include.add(path).end()
        .use(assetLoader)
        .loader(assetLoader)
        .options({
            name      : '[name].[ext]',
            // publicPath: '/' + assetPath + '/fonts/',
            outputPath: assetPath + '/fonts/',
        });
    chain.module.rule('images-' + name)
        .test(/\.*\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .include.add(path).end()
        .use(assetLoader)
        .loader(assetLoader)
        .options({
            name      : '[name].[ext]',
            // publicPath: '/' + assetPath + '/img/',
            outputPath: assetPath + '/img/',
        });
}

export function addPluginEntry(chain: Chain, name: string, dirPath: string, entryFile: string = 'index.ts') {
    let umdName = `@codex/${name}`;
    chain.entry(name)
        .add(chain.srcPath(`pre-path.js?entryName=${name}`))
        .add(isAbsolute(entryFile) ? entryFile : join(dirPath, entryFile));
    chain.externals({
        ...chain.get('externals') || {},
        [ umdName ]: [ 'codex', name ],
    });
    // chain.resolve.alias.set(umdName, dirPath);
    addAssetsLoaderForEntry(chain, name, dirPath);
    chain.module.rule('ts').include.add(dirPath);
    chain.module.rule('js').include.add(dirPath);
}

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
    chain.module.rule('js').use('babel-loader').tap(modifyOptions);
    chain.module.rule('ts').use('babel-loader').tap(modifyOptions);
}

export function addAnalyzerPlugins(chain: Chain, when: boolean = true) {
    chain.when(when, chain => chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [ <BundleAnalyzerPlugin.Options>{
        analyzerMode  : 'static',
        openAnalyzer  : false,
        reportFilename: 'bundle-analyzer.html',
    } ]));
}

export function addPackage(chain: Chain, name: string, umdName?: string) {
    umdName = umdName || `@codex/${name}`;
    chain.when(isDev, chain => {
        let path = rootPath('packages', name, 'src');
        chain.resolve.alias.set(umdName, path);
        chain.module.rule('ts').include.add(path);
    }, chain => {
        chain.resolve.alias.set(umdName, rootPath('packages', name, 'es'));
    });
}

//endregion

//region: Plugins
chain.plugin('clean').use(CleanWebpackPlugin, [
    [ 'js/', 'css/', '*.hot-update.*', 'assets/', 'vendor/' ],
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
    compiledIn: true,
    minimal   : false,
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
    assetsByEntry ? { from: chain.srcPath('core/assets'), to: chain.outPath('vendor/codex_core') } : { from: chain.srcPath('core/assets'), to: chain.outPath('vendor') },

].filter(Boolean) ]);
chain.plugin('html').use(HtmlPlugin, [ <HtmlPlugin.Options>{
    filename          : 'index.html',
    template          : resolve(__dirname, 'index.html'),
    inject            : 'head',
    chunksSortMode    : isDev ? 'dependency' : 'auto',
    templateParameters: {
        assetPath: {
            core:_assetPath.replace('[entrypoint]', 'core'),
            phpdoc:_assetPath.replace('[entrypoint]', 'phpdoc'),
        },
        DEV      : isDev,
        PROD     : isProd,
        TEST     : process.env.NODE_ENV === 'test',
        ENV      : dotenv.load({ path: resolve('.env') }).parsed,
    },
} ]);
chain.plugin('favicon').use(WebappPlugin, [ {
    logo  : rootPath('node_modules/@fortawesome/fontawesome-free/svgs/solid/book.svg'),
    cache,
    prefix: assetsByEntry ? 'vendor/codex_core/img' : 'vendor/img',
    inject: true,
} ]).after('html');

chain.when(isProd, chain => {
    // chain.plugin('write-file').use(require('write-file-webpack-plugin'), [ { useHashIndex: false } ]);
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

chain.when(assetsByEntry, chain => chain.plugin('path').use(EntrypointPathPlugin));
//endregion

//region: Style Loaders
export function addStyleLoaders(config: Configuration) {
    AntdScssThemePlugin.SCSS_THEME_PATH = chain.srcPath('core/styling/antd/theme.scss');
    let antdScssLoader                  = AntdScssThemePlugin.themify({
        loader : 'sass-loader',
        options: {
            scssThemePath: AntdScssThemePlugin.SCSS_THEME_PATH,
            functions    : { [ colorPaletteFunctionSignature ]: colorPaletteFunction },
        },
    });
    let scssLoader                      = { loader: 'sass-loader', options: {} };
    let antdLessLoader                  = AntdScssThemePlugin.themify('less-loader');
    let postCssLoader                   = { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('postcss-clean'), require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } };
    config.module.rules.push(...[ {
        test: /\.module.css$/,
        use : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: isDev, modules: true, localIdentName: '[name]__[local]' } },
            { loader: 'postcss-loader', options: { sourceMap: isDev, plugins: [ require('autoprefixer'), require('cssnext'), require('postcss-nested') ] } },
        ].filter(Boolean),
    }, {
        test   : /\.css$/,
        exclude: [ /\.module.css$/ ],
        use    : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1, sourceMap: isDev } },
            isProd && postCssLoader,
        ].filter(Boolean),
    }, {
        oneOf: [
            {
                test: /\.(module\.scss|mscss)$/,
                use : [
                    isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev, camelCase: false, modules: true, localIdentName: '[name]__[local]' } },
                    isProd && postCssLoader,
                    antdScssLoader,
                ].filter(Boolean),
            }, {
                test   : /\.scss$/,
                exclude: [ /\.module\.scss$/, /\.mscss$/ ],
                use    : [
                    isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev, camelCase: true } },
                    isProd && postCssLoader,
                    antdScssLoader,
                ].filter(Boolean),
            } ],
    }, {
        test: /\.less$/,
        use : [
            isDev ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 2, sourceMap: isDev } },
            isProd && postCssLoader,
            { loader: antdLessLoader.loader, options: { ...antdLessLoader.options, ...{ javascriptEnabled: true, sourceMap: isDev } } },
        ].filter(Boolean),
    } ] as RuleSetRule[]);
    config.plugins.push(new AntdScssThemePlugin(AntdScssThemePlugin.SCSS_THEME_PATH));
    return config;
}

chain.onToConfig(config => addStyleLoaders(config));
//endregion

//region: Optimization
chain.optimization
    .namedChunks(true)
    .namedModules(true)
    .splitChunks(<webpack.Options.SplitChunksOptions>{
        maxInitialRequests: Infinity,
        maxAsyncRequests  : Infinity,
        // maxSize           : Infinity,
        // name              : true,
    })
    .minimize(minimize)
;
chain.optimization.minimizer('terser').use(TerserPlugin, [ <TerserPlugin.TerserPluginOptions>{
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
} ]);
chain.when(isDev, chain => {}, chain => {});
//endregion

//region: Init
chain
    .target('web')
    .cache(cache)
    .devtool(isDev ? 'cheap-module-source-map' : false as any)
;
chain.output
    .path(chain.outPath())
    .pathinfo(isDev)
    .publicPath('/')
    .library([ 'codex', '[name]' ] as any)
    .libraryTarget('window')
    .filename(assetPath('js/[name].js'))
    .chunkFilename(assetPath('js/chunk.[name].js'));

chain.output.when(isDev, chain => chain
    .sourceMapFilename('[file].map')
    .devtoolModuleFilenameTemplate((info: DevtoolModuleFilenameTemplateInfo) => {
        // return 'file://' + resolve(info.absoluteResourcePath.replace(/\\/g, '/'));
        return resolve(info.absoluteResourcePath.replace(/\\/g, '/'));
    }),
);
chain.resolve
    .symlinks(true)
    .extensions.merge([ '.js', '.vue', '.json', '.web.ts', '.ts', '.web.tsx', '.tsx', '.styl', '.less', '.scss', '.stylus', '.css', '.mjs', '.web.js', '.json', '.web.jsx', '.jsx' ]).end()
    .mainFields.merge([ 'module', 'browser', 'main' ]).end() // 'jsnext:main',
    .mainFiles.merge([ 'index', 'index.ts', 'index.tsx' ]).end()
    .modules.merge([ 'node_modules' ]).end()
    .alias.merge({
    'mobx$'            : chain.srcPath('mobx.js'),
    'lodash-es$'       : 'lodash',
    'async$'           : 'neo-async',
    // 'react-dom'        : '@hot-loader/react-dom',
    '@ant-design/icons': 'purched-antd-icons', /** @see https://github.com/ant-design/ant-design/issues/12011 */
}).end();
chain.resolveLoader
    .modules.merge([ 'node_modules' ]).end()
    .extensions.merge([ '.js', '.json', '.ts' ]).end();
chain.externals({});
chain.stats({
    warningsFilter: /export .* was not found in/,
});
chain.node.merge({
    dgram        : 'empty',
    fs           : 'empty',
    net          : 'empty',
    tls          : 'empty',
    child_process: 'empty',
    // module       : 'empty',
    // dns          : 'mock',
});
chain.performance
    .hints(false)
    .maxEntrypointSize(999999999)
    .maxAssetSize(999999999)
    .assetFilter(as => false);
chain.module.set('strictExportPresence', true);
chain.module.rule('ts').test(/\.(ts|tsx)$/);
chain.module.rule('js').test(/\.(js|mjs|jsx)$/);
chain.module.rule('vendor-js').test(/\.(js|mjs)$/).exclude.add(/@babel(?:\/|\\{1,2})runtime/);

addTsToRule(chain, 'ts', {});
addBabelToRule(chain, 'js', {
    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
});
addBabelToRule(chain, 'vendor-js', {
    presets   : [ [ require.resolve('babel-preset-react-app/dependencies'), { helpers: true } ] ],
    plugins   : [
        ...babelImportPlugins,
    ],
    sourceMaps: false,
});
addPackage(chain, 'api', '@codex/api');
// addPluginEntry(chain, 'router', chain.srcPath('router'), 'index.tsx')
// addPluginEntry(chain, 'core', chain.srcPath('core'), '_small.tsx');

addPluginEntry(chain, 'core', chain.srcPath('core'), 'index.tsx');
addPluginEntry(chain, 'phpdoc', chain.srcPath('phpdoc'), 'index.tsx');
addPluginEntry(chain, 'comments', chain.srcPath('comments'), 'index.tsx');
chain.resolve.modules.merge([ chain.srcPath('core') ]).end();
chain.resolve.alias.merge({
    'heading'            : chain.srcPath('core/styling/heading.less'),
    '../../theme.config$': chain.srcPath('core/styling/theme.config'),
    './core/index.less$' : chain.srcPath('core/styling/antd/core.less'),
});
//endregion


const config = chain.toConfig();

export default config;
export { chain, config };
