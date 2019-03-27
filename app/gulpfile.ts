import { mixin, utils } from '@radic/build-tools';
import { gulp, Gulpclass, GulpEnvMixin, Task } from '@radic/build-tools-gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Chain } from './build/chain';
import { dirname, relative, resolve } from 'path';
import { getFileSizeInfo } from '@radic/build-tools/dist/utils';
import { readFileSync } from 'fs';
import SMP from 'speed-measure-webpack-plugin';
import 'webpack-hot-middleware';
import globule from 'globule';
import { copySync, emptyDirSync, existsSync, mkdirpSync, rmdirSync, unlinkSync } from 'fs-extra';
import { bundle } from 'dts-bundle/lib/index';


const path = (...parts: string[]) => resolve(__dirname, 'src', ...parts);


const chalk = require('chalk').default;
require('ts-node').register({ transpileOnly: true, typeCheck: false });

const smp             = new SMP();
// Import the plugin:
const DashboardPlugin = require('webpack-dashboard/plugin');

interface Gulpfile extends GulpEnvMixin {}

@Gulpclass(gulp)
@mixin(GulpEnvMixin)
class Gulpfile {
    @Task('dev:build')
    async devBuild() {
        this.dev();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        addAnalyzerPlugins(chain);
        await this.build(chain);
        reportFileSizes(chain.outPath('js/*.js'));
    }

    @Task('dev:watch')
    async devWatch() {
        this.dev();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        addAnalyzerPlugins(chain);
        this.watch(chain);
    }

    @Task('dev:serve')
    async devServe() {
        this.dev();
        const { chain, addAnalyzerPlugins, addHMR } = require('./webpack.config');
        addHMR(chain, true);
        return this.serve(chain);
    }

    @Task('dev:dashboard')
    async devDashboard() {
        this.dev();
        const { chain, addAnalyzerPlugins, addHMR } = require('./webpack.config');
        chain.plugin('dashboard').use(DashboardPlugin, [ {} ]);
        addHMR(chain, true);
        addAnalyzerPlugins(chain, true);
        return this.serve(chain);
    }


    @Task('prod:build')
    async prodBuild() {
        this.prod();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        addAnalyzerPlugins(chain);
        await this.build(chain);
    }

    @Task('prod:report')
    async prodReport() {
        this.prod();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        reportFileSizes(...[ chain.outPath('**/*.js'), chain.outPath('**/*.css') ]);
    }

    @Task('prod:watch')
    prodWatch() {
        this.prod();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        chain.optimization.minimize(false);
        addAnalyzerPlugins(chain);
        return this.watch(chain);
    }

    @Task('dts')
    dts() {
        const { chain } = require('./webpack.config');
        // process.chdir(chain.srcPath('core'));

        // const project = gulpTs.createProject(chain.srcPath('core/tsconfig.json'), {
        //     typescript           : ts,
        //     emitDeclarationOnly  : true,
        //     jsx                  : 'react' as any,
        //     noStrictGenericChecks: true,
        //     declarationDir       : chain.outPath('types'),
        //     // outDir               : 'out',
        // } as ts.CompilerOptions & gulpTs.Settings);
        // gulp
        //     .src(chain.srcPath('core/**/*.ts'))
        //     .pipe(project())
        //     .dts.pipe(gulp.dest(chain.outPath('types')));
        //
        // process.chdir(__dirname);

        // const dtsDir = copydts(resolve(__dirname, 'out'));

        function bundledts(name: string) {
            bundle({
                name      : `@codex/${name}`,
                main      : `./out/${name}/index.d.ts`,
                out       : `../codex.${name}.d.ts`,
                headerPath: null,
                headerText: `
I'm quite mellow
A white fellow
My pee is bright yellow
I like jello
I'm like hello
﻿`,
            });
        }

        bundledts('core');
    }

    protected async serve(chain: Chain, host: string = 'localhost', port: number = 8513) {
        port      = await utils.choosePort(host, port);
        const url = `http://${host}:${port}`;
        chain.data.merge({ host, port, url });

        chain.output.publicPath(url + '/');

        chain.devServer
            .contentBase([ chain.outPath() ])
            .historyApiFallback({
                disableDotRule: true,
            })
            .hot(chain.plugins.has('hmr'))
            .inline(true)
            .progress(true)
            .quiet(true)
            .stats({
                ...chain.get('stats'),
                // errors-only preset
                all        : false,
                errors     : true,
                moduleTrace: true,
            })
            .host(host)
            .port(port)
            .headers({ 'Access-Control-Allow-Origin': '*' })
            .public(url + '/')
            .publicPath('/');

        console.log('Starting dev-server @ ', url);

        let config                        = chain.toConfig();
        config.devServer.proxy            = {
            '/api': {
                target             : 'http://codex.local',
                secure             : false,
                changeOrigin       : true,
                cookieDomainRewrite: 'localhost',
                onProxyReq         : proxyReq => {
                    // Browers may send Origin headers even with same-origin
                    // requests. To prevent CORS issues, we have to change
                    // the Origin to match the target URL.
                    if ( proxyReq.getHeader('origin') ) {
                        proxyReq.setHeader('origin', 'http://codex.local');
                    }
                },
            },
        };
        config.devServer[ 'writeToDisk' ] = true;
        WebpackDevServer.addDevServerEntrypoints(config, config.devServer);
        config         = smp.wrap(config) as any;
        const compiler = webpack(config);
        const server   = new WebpackDevServer(compiler, config.devServer);


        return new Promise((res, rej) => {
            const app = server.listen(port, host, (err: Error) => {
                if ( err ) return rej(err);
                console.log(`Server started @ ${url}`);
                res();
            });
        });
    }

    protected watch(chain: Chain) {
        const config = chain.toConfig();
        webpack(config).watch({}, (err, stats) => {
            if ( err ) {
                return console.error(err);
            }
            reportFileSizes(chain.outPath('vendor/**/*.js') as any);
        });
    }

    protected async build(chain: Chain) {
        const config = chain.toConfig();
        return new Promise<webpack.Stats>((resolve, reject) => {
            webpack(config, (err, stats) => {
                if ( err ) {
                    return reject(err);
                }
                resolve(stats);
            });
        });
    }
}

function reportFileSizes(...globs: string[]) {

    const gzipsize = require('gzip-size');
    const filesize = require('filesize');
    let files: Array<{
        name: string;
        path: string;
        size: string;
        sizeInfo: utils.FileSizeInfo;
        relativePath: string
        gzipSize: string;
    }>             = [];

    function customReporter(file: {
        name: string;
        path: string;
        size: string;
        gzipSize: string;
    }): void {

        (file as any).sizeInfo     = getFileSizeInfo(file.path);
        (file as any).relativePath = relative(__dirname, file.path).replace(/^.*\/vendor\//m, '');
        files.push(file as any);
    }

    utils.reportFileSizes(globs, { customReporter });


    let ui = require('cliui')({ width: process.stdout.columns });
    ui.div(chalk.bold('Name'), chalk.bold('Size'), chalk.bold('Gzip'));

    let totalSize     = 0;
    let totalGzipSize = 0;
    files
        .sort((a, b) => {
            return a.sizeInfo.stats.size < b.sizeInfo.stats.size ? 1 : - 1;
        })
        .forEach(file => {
            totalSize += file.sizeInfo.stats.size;
            totalGzipSize += gzipsize.sync(readFileSync(file.path, 'utf8'));
            ui.div(file.relativePath, file.size, file.gzipSize);
        });

    ui.div(chalk.bold('---'), chalk.bold('---'), chalk.bold('---'));
    ui.div(chalk.bold('TOTAL:'), filesize(totalSize), filesize(totalGzipSize));
    console.log(ui.toString() + '\n');
}


function cleanjs() {
    let timestamp      = Date.now();
    let backupDir      = resolve(__dirname, '../.tmp/.cleanjs-' + timestamp);
    let corePaths      = path('*/**/*.js');
    let filePaths: any = globule.find(corePaths, {
        ignore: [
            path('core/utils/zepto.js'),
        ],
    });
    if ( existsSync(backupDir) ) {
        rmdirSync(backupDir);
    }
    mkdirpSync(backupDir);
    filePaths.forEach(filePath => {
        const backupFilePath = resolve(backupDir, relative(resolve(__dirname, 'src'), filePath));
        const backupDirPath  = dirname(backupFilePath);
        if ( ! existsSync(backupDirPath) ) {
            mkdirpSync(backupDirPath);
        }
        copySync(filePath, backupFilePath);
        unlinkSync(filePath);
        console.log('removed', filePath);
    });
}

function copydts(fromDir) {
    let timestamp      = Date.now();
    let tmpDir         = resolve(__dirname, '../.tmp/.copydts-' + timestamp);
    let corePaths      = resolve(fromDir, '{auth,comments,core,phpdoc}/**/*.d.ts');
    let filePaths: any = globule.find(corePaths, {
        ignore: [
            path('core/utils/zepto.js'),
        ],
    });
    if ( existsSync(tmpDir) ) {
        emptyDirSync(tmpDir);
        rmdirSync(tmpDir);
    }
    mkdirpSync(tmpDir);
    filePaths.forEach(filePath => {
        const backupFilePath = resolve(tmpDir, relative(resolve(__dirname, 'src'), filePath));
        const backupDirPath  = dirname(backupFilePath);
        if ( ! existsSync(backupDirPath) ) {
            mkdirpSync(backupDirPath);
        }
        copySync(filePath, backupFilePath);
        unlinkSync(filePath);
        console.log('removed', filePath);
    });

    return tmpDir;
}
