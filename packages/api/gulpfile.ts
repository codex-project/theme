import { mixin } from '@radic/build-tools';
import { gulp, Gulpclass, GulpEnvMixin, GulpInteractiveMixin, Task } from '@radic/build-tools-gulp';

import { generate } from 'graphql-code-generator';
import { createProject, reporter } from 'gulp-typescript';
import pump from 'pump';
import { resolve } from 'path';
import merge2 from 'merge2';

export interface Gulpfile extends GulpEnvMixin, GulpInteractiveMixin {}

const tsconfigPath = resolve(__dirname, 'src/tsconfig.json');
const projects     = {
    es : createProject(tsconfigPath, {
        outDir         : 'es',
        module         : 'esnext',
        target         : 'es5',
        inlineSourceMap: false,
    }),
    lib: createProject(tsconfigPath, {
        outDir         : 'es',
        module         : 'commonjs',
        target         : 'es5',
        inlineSourceMap: false,
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
    @Task('graphql')
    async generateGraphQL() {
        return generate({
            schema   : 'http://codex.local/api',
            generates: {
                [ process.cwd() + '/src/types.ts' ]: {
                    plugins: [
                        'typescript-common',
                        'typescript-client',
                        'typescript-server',
                    ],
                },
            },
            require  : [ 'ts-node/register' ],
            overwrite: true,
        });
    }

    @Task('watch', [ 'build' ]) watch() {
        gulp.watch('src/*.ts', [ 'build' ]);
    }

    @Task('build')
    async build() {
        await this.buildProject('es');
        // await this.buildProject('lib');
    }


    buildProject(name: 'es' | 'lib') {
        let result = gulp
            .src('src/**/*.ts', { base: resolve(__dirname,'src') })
            .pipe(projects[ name ]());

        return merge2(
            result.js.pipe(gulp.dest(name)),
            result.dts.pipe(gulp.dest('types')),
        );
    }


}
