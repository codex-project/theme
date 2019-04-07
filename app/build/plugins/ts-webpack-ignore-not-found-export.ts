import { Compiler } from 'webpack';

const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning');
const ModuleDependencyError   = require('webpack/lib/ModuleDependencyError');
// ↓ Based on https://github.com/sindresorhus/escape-string-regexp
const escapeStringForRegExp   = string => string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

export interface IgnoreNotFoundExportPluginOptions {
    exportsToIgnore: string[]
}

const NAME = 'IgnoreNotFoundExportPlugin';

export class IgnoreNotFoundExportPlugin {

    constructor(public options?: IgnoreNotFoundExportPluginOptions) {
        this.options = {
            exportsToIgnore: [],
            ...options,
        };
    }

    getMessageRegExp() {
        const exportsPattern = `(${this.options.exportsToIgnore.join('|')})`; // .map(escapeStringForRegExp)

        return new RegExp(`export '${exportsPattern}'(.+?)was not found in (.+)`);
    }

    apply(compiler: Compiler) {
        const messageRegExp = this.getMessageRegExp();

        compiler.hooks.make.tap(NAME, (compilation, normalModuleFactory) => {
            compilation.hooks.finishModules.tap(NAME, modules => {

                for ( let index = 0; index < modules.length; index ++ ) {
                    const module: any = modules[ index ];
                    const blocks      = [ module ];
                    for ( let indexBlock = 0; indexBlock < blocks.length; indexBlock ++ ) {
                        const block        = blocks[ indexBlock ];
                        const dependencies = block.dependencies;

                        for ( let indexDep = 0; indexDep < dependencies.length; indexDep ++ ) {
                            let d          = dependencies[ indexDep ];
                            const warnings = d.getWarnings();
                            const errors   = d.getErrors() as Error[];
                            if ( errors ) {
                                const _getErrors = d._getErrors;
                                for ( let indexErr = 0; indexErr < errors.length; indexErr ++ ) {
                                    let ignoreErrors = errors.filter(error => messageRegExp.test(error.message) === true);
                                    if ( ignoreErrors.length > 0 ) {
                                        d._getErrors = function () {
                                            return _getErrors.apply(this).filter(error => messageRegExp.test(error.message) === false);
                                        };
                                    }
                                }
                            }
                        }

                    }
                }
            });
        });
    }
};
