// @ts-ignore
import tsconfig from './src/tsconfig.json';
import { uniq } from 'lodash';
import { resolve, relative, dirname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import glob = require('glob');

let paths = [];

const src = (...parts: string[]) => resolve(__dirname, 'src', ...parts);


function modify(filePath:string,content: string) {
    let paths = Object
        .keys(tsconfig.compilerOptions.paths)
        .filter(key => [ '*' ].includes(key) === false)
        .map(key => ({ from: key, to: tsconfig.compilerOptions.paths[ key ] }))
        .map(path => {
            src(path.from);
            const exp = () => {
                let fromExp = path.from.replace(/\*/g, '[\\w\/\\.]*');
                return new RegExp('^(.*) from ([\\\'|\\"])(' + fromExp + ')([\\\'|\\"])', 'gm');
            };


            let has = exp().test(content);

            return { from: path.from, to: path.to, exp, test: (str: string) => exp().test(str) };
        });

    paths.forEach(path => {
        if ( ! path.test(content) ) return;

        let exp = path.exp();

        let rel = relative(filePath, src())
        rel = rel.replace(/^\.\.$/,'.');
        rel = rel.replace('../..', '..')

        content = content.replace(exp, '$1 from $2' + rel + '\/$3$4');
        return rel;
    });

    return content;
}

glob.sync(src('**/*{.ts,.tsx}')).forEach(filePath => {
    const content  = readFileSync(filePath, 'utf8');
    const modified = modify(filePath,content);
    if ( content !== modified ) {
        writeFileSync(filePath, modified, 'utf8')
    }
});

console.log('oik');
uniq(paths);
