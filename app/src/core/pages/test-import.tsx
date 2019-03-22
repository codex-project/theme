import { loader } from 'components/loader';

const log               = require('debug')('test-import');
export const TestImport = loader({
    loadable: () => import('./TestImportComponent'),
    // loadable   : () => {
    //     return new Promise((resolve, reject) => {
    //         import('./TestImportComponent').then(mod => {
    //             setTimeout(() => resolve(mod), 2500);
    //         });
    //     });
    // },
    animated   : true,
    showLoading: true,
});
