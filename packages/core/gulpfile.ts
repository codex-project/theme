import { mixin } from '@radic/build-tools';
import { getAppPluginBuildTools } from '@codex/build-tools';
import { gulp, Gulpclass, GulpEnvMixin, GulpInteractiveMixin, Task } from '@radic/build-tools-gulp';
import { createProject } from 'gulp-typescript';
import { resolve } from 'path';
import merge2 from 'merge2';
import webpack from 'webpack';
import { Chain } from '@codex/site/build/chain';
import { rollup } from 'rollup';

export interface Gulpfile extends GulpEnvMixin, GulpInteractiveMixin {}

const tsconfigPath = resolve(__dirname, 'src/tsconfig.json');
const projects     = {
    es : createProject(tsconfigPath, {
        outDir          : 'es',
        module          : 'esnext',
        target          : 'es6',
        inlineSourceMap : false,
        declaration     : true,
        declarationFiles: true,

        jsx: 'preserve',
    }),
    lib: createProject(tsconfigPath, {
        outDir         : 'lib',
        module         : 'commonjs',
        target         : 'es5',
        inlineSourceMap: false,
        jsx            : 'react',
    }),
    // umd: createProject(tsconfigPath, {
    //     outDir         : 'es',
    //     module         : 'commonjs',
    //     target         : 'es5',
    //     inlineSourceMap: false,
    // }),
};


@Gulpclass(gulp)
@mixin(GulpEnvMixin)
@mixin(GulpInteractiveMixin)
export class Gulpfile {
    @Task('watch', [ 'build' ]) watch() {
        gulp.watch('src/*.ts', [ 'build' ]);
    }

    @Task('build')
    build() {
        this.buildProject('es');
    }

    buildProject(name: 'es' | 'lib') {
        let result = gulp
            .src([ 'src/**/*.ts', 'src/**/*.tsx', 'types/index.d.ts' ]) //, { base: resolve(__dirname,'src') })
            .pipe(projects[ name ]());

        return merge2(
            result.js.pipe(gulp.dest(name)),
            result.dts.pipe(gulp.dest(name)),
        );
    }

    rollup(){
        rollup({
            input: ''
        })
    }

    @Task('webpack')
    async webpack() {
        this.dev();
        const { chain } = getAppPluginBuildTools({
            cwd: __dirname,
        });
        await this.buildWebpack(chain);
    }

    protected async buildWebpack(chain: Chain) {
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
