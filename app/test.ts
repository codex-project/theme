import globule = require('globule');
import { dirname, relative, resolve } from 'path';
import { copySync, existsSync, mkdirpSync, rmdirSync, unlinkSync } from 'fs-extra';

const path = (...parts: string[]) => resolve(__dirname, 'src', ...parts);

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
// copySync(filePath, '',{})
    const backupFilePath = resolve(backupDir, relative(resolve(__dirname, 'src'), filePath));
    const backupDirPath  = dirname(backupFilePath);

    if ( ! existsSync(backupDirPath) ) {
        mkdirpSync(backupDirPath);
    }

    copySync(filePath, backupFilePath);
    unlinkSync(filePath);

    console.log('removed', filePath);
});
