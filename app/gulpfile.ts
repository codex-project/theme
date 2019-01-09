import { mixin, utils } from '@radic/build-tools';
import { gulp, Gulpclass, GulpEnvMixin, Task } from '@radic/build-tools-gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Chain } from './build/chain';

const chalk = require('chalk').default;
require('ts-node').register({ transpileOnly: true, typeCheck: false });

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
        addAnalyzerPlugins(chain);
        addHMR(chain, true);
        return this.serve(chain);
    }

    @Task('prod:build')
    async prodBuild() {
        this.prod();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        addAnalyzerPlugins(chain);
        await this.build(chain);
        reportFileSizes(chain.outPath('js/*.js'));
    }

    @Task('prod:watch')
    prodWatch() {
        this.prod();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        addAnalyzerPlugins(chain);
        this.watch(chain);
    }

    protected async serve(chain: Chain, host: string = 'localhost', port: number = 8513) {
        port      = await utils.choosePort(host, port);
        const url = `http://${host}:${port}`;
        chain.data.merge({ host, port, url });

        chain.output.publicPath(url + '/');

        chain.devServer
            .contentBase([ chain.outPath() ])
            .historyApiFallback(true)
            .hotOnly(true)
            .inline(true)
            .progress(true)
            .quiet(true)
            .stats('errors-only')
            .host(host)
            .port(port)
            .headers({ 'Access-Control-Allow-Origin': '*' })
            .public(url + '/')
            .publicPath('/')
            .set('before', app => app.use(require('morgan')(':method :url :status :res[content-length] - :response-time ms')));

        // chain.devServer
        //     .contentBase(contentBase)  //resolve(__dirname, '../../../public')
        //     .watchContentBase(true)
        //     .set('disableHostCheck', true)
        //     .quiet(false)


        console.log('Starting dev-server @ ', url);

        const config = chain.toConfig();
        WebpackDevServer.addDevServerEntrypoints(config, config.devServer);
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
            reportFileSizes(chain.outPath('js/*.js') as any);
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

function reportFileSizes(globs) {

    function customReporter(file: {
        name: string;
        path: string;
        size: string;
        gzipSize: string;
    }): void {

        const ui = require('cliui')({ width: process.stdout.columns });
        ui.div(file.name, file.size, file.gzipSize);
        console.log(ui.toString());
    }

    const ui = require('cliui')({ width: process.stdout.columns });
    ui.div(chalk.bold('Name'), chalk.bold('Size'), chalk.bold('Gzip'));
    console.log(ui.toString());
    utils.reportFileSizes(globs, { customReporter });
}
