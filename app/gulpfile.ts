import { mixin, utils } from '@radic/build-tools';
import { gulp, Gulpclass, GulpEnvMixin, Task } from '@radic/build-tools-gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import serve,{Options as ServeOptions} from 'webpack-serve';
import { Chain } from './build/chain';
import { relative } from 'path';
import { getFileSizeInfo } from '@radic/build-tools/dist/utils';
import { readFileSync } from 'fs';
import SMP from 'speed-measure-webpack-plugin';

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
        addAnalyzerPlugins(chain);
        return this.watch(chain);
    }
    protected async serve4(chain: Chain, host: string = 'localhost', port: number = 8513) {
        port      = await utils.choosePort(host, port);
        const url = `http://${host}:${port}`;
        chain.data.merge({ host, port, url });

        chain.output.publicPath(url + '/');

        let config             = chain.toConfig();
        config.serve = {
            config,
            devMiddleware: {
                publicPath: chain.output.get('publicPath'),
                headers: {                    'Access-Control-Allow-Origin': '*'                },
                writeToDisk:true
            },
            hotClient: {

            }
        }

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
            .hot(true)
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
        // .set('before', app => app.use(require('morgan')(':method :url :status :res[content-length] - :response-time ms')));

        // chain.devServer
        //     .contentBase(contentBase)  //resolve(__dirname, '../../../public')
        //     .watchContentBase(true)
        //     .set('disableHostCheck', true)
        //     .quiet(false)


        console.log('Starting dev-server @ ', url);

        let config             = chain.toConfig();
        config.devServer.proxy = {
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
        config.devServer['writeToDisk']=true;
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

    protected watch(chain) {
        const config = chain.toConfig();
        webpack(config).watch({}, (err, stats) => {
            if ( err ) {
                return console.error(err);
            }
            reportFileSizes(chain.outPath('vendor/**/*.js') as any);
        });
    }

    protected async build(chain) {
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
