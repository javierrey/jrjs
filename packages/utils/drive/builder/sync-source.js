// sync-source.js
// @ts-check

import {
  envInfo, log, toBoo, fileExists, removeDir, copyDir, symlinkDir,
} from '../../../lib/drive/drive.js';

const cloneMethod = envInfo.args.method === 'copy' ? copyDir : symlinkDir; // symlink, copy

const srcBase = envInfo.args.src || 'packages';
const tgtBase = envInfo.args.tgt || 'packages/main';
const tgtName = tgtBase.split('/', 2).at(-1) || 'main';

const srcCore = tgtBase + '/core'; // Target package core folder.

/** @param {string} ctx @param {string[]} imports */
const generateContext = (ctx, imports = []) => {
  const tgtCtx = tgtBase + `/${ctx}/imported`;
  removeDir(tgtCtx);

  cloneMethod(srcBase + '/lib/core', tgtCtx + '/lib/core');
  cloneMethod(srcBase + `/lib/${ctx}`, tgtCtx + `/lib/${ctx}`);
  cloneMethod(srcBase + '/utils/core', tgtCtx + '/utils/core');
  cloneMethod(srcBase + `/utils/${ctx}`, tgtCtx + `/utils/${ctx}`);
  cloneMethod(srcCore, tgtCtx + `/${tgtName}/core`);

  /** @type {string[]} */ const errors = [];
  imports.forEach((folder) => {
    let src = srcBase + `/imports/${ctx}/${folder}`;
    fileExists(src) && cloneMethod(src, tgtCtx + `/imports/${ctx}/${folder}`);
    src = srcBase + `/imports/core/${folder}`;
    fileExists(src) ? cloneMethod(src, tgtCtx + `/imports/core/${folder}`)
      : errors.push(`${ctx}-imports not found: ${src}`);
  });
  errors.length && log.error(...errors);
};

/** @param {string} ctxArg */
const processContextArg = (ctxArg, dfault = '') => {
  let imports = envInfo.args[ctxArg] ?? dfault; const truthy = toBoo(imports);
  if (['null', 'undefined', 'NaN', 'false', '0', '!1', 'true', '1', '!0', "''", '""', '[]', '{}'].includes(imports))
    imports = '';
  truthy && generateContext(ctxArg, imports.split(',').filter(Boolean));
};

/**
Clones `view` dependencies into a generated `imported` subfolder, based on the argument value: default 'true'.
Public `view` dependencies must point to the `imported` subfolder, so they are available on the client side.
The value can also be a comma-separated list of additional modules from the `imports/view` context.
*/
processContextArg('view', '1');

/**
Clones `drive` dependencies into a generated `imported` subfolder, based on the argument value: default 'false'.
Unlike `view`, the `drive` folder is not public and its dependencies can be referenced directly.
The value can also be a comma-separated list of additional modules from the `imports/drive` context.
*/
processContextArg('drive');
