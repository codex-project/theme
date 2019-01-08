import { mixin, utils } from '@radic/build-tools';
import { gulp, Gulpclass, GulpEnvMixin, Task } from '@radic/build-tools-gulp';
import webpack from 'webpack';

const chalk = require('chalk').default;

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

    @Task('prod:build')
    async prodBuild() {
        this.prod();
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

    @Task('prod:watch')
    prodWatch() {
        this.prod();
        const { chain, addAnalyzerPlugins } = require('./webpack.config');
        addAnalyzerPlugins(chain);
        this.watch(chain);
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
