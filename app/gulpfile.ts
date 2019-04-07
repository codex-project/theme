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
import { execSync } from 'child_process';
import cmd from 'commander';
import { addAnalyzerPlugins, addHMR } from './webpack.config';


const path  = (...parts: string[]) => resolve(__dirname, 'src', ...parts);
const chalk = require('chalk').default;
const log   = (...args) => require('fancy-log')(...args);
require('ts-node').register({ transpileOnly: true, typeCheck: false });
const smp = new SMP();

cmd
    .option('-D|--debug', 'Enable Debug')
    .option('--production', 'Enable production mode')
    .option('--analyze', 'Use Analyzer plugin')
    .option('--duplicates', 'Use Duplicates plugin')
    .option('--hmr', 'Enable HMR')
    .option('--hmr-react', 'Enable HMR + React Hot Loader')
    .option('--dashboard', 'Use Dasboard plugin')
    .option('--dashboard-port [port]', 'Use Dasboard plugin', 23345)
    .option('--report', 'Report file sizes on build')
    .option('--report-globs [globs]', 'Globs to use for reporting file sizes [globs: "**/*.js,**/*.css"]', '**/*.js,**/*.css')
    .option('--backend-url [url]', 'Backend base url (BACKEND_URL)')
    .option('--dev-proxy-target [url]', 'webpack-dev-server api proxy target url', 'http://codex.local')
    .parse(process.argv);
cmd.tryReport = (chain: Chain) => cmd.report && reportFileSizes(...(cmd.reportGlobs.toString().split(',').map(chain.outPath)));
if ( cmd.debug ) console.dir({ args: cmd.args, opts: cmd.opts() });


interface Gulpfile extends GulpEnvMixin {}

@Gulpclass(gulp)
@mixin(GulpEnvMixin)
class Gulpfile {
    protected addPlugins(chain: Chain) {
        const { addAnalyzerPlugins, addHMR, addDashboardPlugin, addDuplicatesPlugin } = require('./webpack.config');
        const _plugin                                                                 = (when: boolean, str: string, fn: Function, ...fnArgs: any[]) => {
            if ( !when ) return;
            log(`Using ${chalk.bold(str)}`);
            fn(chain, ...fnArgs);
        };
        _plugin(cmd.analyze, 'Analyzer', addAnalyzerPlugins);
        _plugin(cmd.hmr || cmd.hmrReact, cmd.hmrReact ? 'HMR + React Hot Loader' : 'HMR', addHMR, cmd.hmrReact);
        _plugin(cmd.dashboard, 'Dashboard', addDashboardPlugin, cmd.dashboardPort);
        _plugin(cmd.duplicates, 'Duplicates', addDuplicatesPlugin);
        return this;
    }

    protected pre(errorOnRunned?: boolean) {
        if ( !this.runnedEnv ) {
            if ( cmd.production ) {
                this.prod(errorOnRunned);
            } else {
                this.dev(errorOnRunned);
            }
        }
        let webpackConfig = require('./webpack.config');
        this.addPlugins(webpackConfig.chain);
        return webpackConfig;
    }

    @Task('default')
    default() {
        cmd.help(str => {

            return `${str}\nTasks:\n` + Object.keys(gulp.tasks).map(name => gulp.tasks[ name ]).map(task => `  - ${task.name}`).join('\n');
        });
    }

    @Task('build')
    async build() { return this._build(this.pre().chain); }

    @Task('watch')
    async watch() { return this._watch(this.pre().chain); }

    @Task('serve')
    async serve() { return this._serve(this.pre().chain); }

    @Task('report')
    report() { cmd.tryReport(this.pre().chain); }

    // @Task('prod:watch') prodWatch() {return this._watch(chain, stats => this.nps());    }

    @Task('nps')
    nps() {
        execSync('yarn nps copy:theme:assets:dist', {
            cwd     : resolve(__dirname, '../../codex'),
            stdio   : 'inherit',
            encoding: 'utf8'
        });
    }

    @Task('dts')
    dts() {
        const { chain } = require('./webpack.config');
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
﻿`
            });
        }

        bundledts('core');
    }

    protected async _serve(chain: Chain, host: string = 'localhost', port: number = 8513) {
        port      = await utils.choosePort(host, port);
        const url = `http://${host}:${port}`;
        chain.data.merge({ host, port, url });

        chain.output.publicPath(url + '/');

        chain.devServer
            .contentBase([ chain.outPath() ])
            .historyApiFallback({
                disableDotRule: true
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
                moduleTrace: true
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
                target             : cmd.devProxyTarget,
                secure             : false,
                changeOrigin       : true,
                cookieDomainRewrite: 'localhost',
                onProxyReq         : proxyReq => {
                    // Browers may send Origin headers even with same-origin
                    // requests. To prevent CORS issues, we have to change
                    // the Origin to match the target URL.
                    if ( proxyReq.getHeader('origin') ) {
                        proxyReq.setHeader('origin', cmd.devProxyTarget);
                    }
                }
            }
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

    protected _watch(chain: Chain, cb?: (stats) => any) {
        const config = chain.toConfig();
        webpack(config).watch({}, (err, stats) => {
            if ( err ) {
                return console.error(err);
            }
            cmd.tryReport(chain);
            if ( cb ) {
                cb(stats);
            }
        });
    }

    protected async _build(chain: Chain) {
        const config = chain.toConfig();
        return new Promise<webpack.Stats>((resolve, reject) => {
            webpack(config, (err, stats) => {
                if ( err ) {
                    return reject(err);
                }
                cmd.tryReport(chain);
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
            path('core/utils/zepto.js')
        ]
    });
    if ( existsSync(backupDir) ) {
        rmdirSync(backupDir);
    }
    mkdirpSync(backupDir);
    filePaths.forEach(filePath => {
        const backupFilePath = resolve(backupDir, relative(resolve(__dirname, 'src'), filePath));
        const backupDirPath  = dirname(backupFilePath);
        if ( !existsSync(backupDirPath) ) {
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
            path('core/utils/zepto.js')
        ]
    });
    if ( existsSync(tmpDir) ) {
        emptyDirSync(tmpDir);
        rmdirSync(tmpDir);
    }
    mkdirpSync(tmpDir);
    filePaths.forEach(filePath => {
        const backupFilePath = resolve(tmpDir, relative(resolve(__dirname, 'src'), filePath));
        const backupDirPath  = dirname(backupFilePath);
        if ( !existsSync(backupDirPath) ) {
            mkdirpSync(backupDirPath);
        }
        copySync(filePath, backupFilePath);
        unlinkSync(filePath);
        console.log('removed', filePath);
    });

    return tmpDir;
}

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
