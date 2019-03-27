import globule from 'globule';
import { dirname, relative, resolve } from 'path';
import { copySync, emptyDirSync, existsSync, mkdirpSync, rmdirSync, unlinkSync } from 'fs-extra';
import { bundle } from 'dts-bundle/lib/index';

const path = (...parts: string[]) => resolve(__dirname, 'src', ...parts);


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

function copydts() {
    let timestamp      = Date.now();
    let tmpDir         = resolve(__dirname, '../.tmp/.copydts-' + timestamp);
    let corePaths      = path('{auth,comments,core,phpdoc}/**/*.d.ts');
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


function bundledts(dir: string) {
    bundle({
        name      : 'codex.core',
        main      : resolve(dir, 'index.d.ts'),
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

const hasArg = (arg: string) => process.argv.includes(arg);

if(hasArg('cleanjs')) {
    cleanjs();
}

if(hasArg('copydts')) {
    const dtsDir = copydts();
}
