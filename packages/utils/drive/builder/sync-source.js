// sync-source.js
// @ts-check

import {
  log, getArgumentValue, fileExists, removeDir, copyDir, symlinkDir,
} from '../../../lib/drive/drive.js';

const cloneMethod = getArgumentValue('method') === 'copy' ? copyDir : symlinkDir; // symlink, copy

const origBase = getArgumentValue('orig') || 'packages';
const destBase = getArgumentValue('dest') || 'packages/main';

const origCore = destBase + '/core'; // Target package core folder.

/** @param {string} ctx @param {string[]} imports */
const generateContext = (ctx, imports = []) => {
  const destCtx = destBase + `/${ctx}/imported`;
  removeDir(destCtx);

  cloneMethod(origBase + '/lib/core', destCtx + '/lib/core');
  cloneMethod(origBase + `/lib/${ctx}`, destCtx + `/lib/${ctx}`);
  cloneMethod(origBase + '/utils/core', destCtx + '/utils/core');
  cloneMethod(origBase + `/utils/${ctx}`, destCtx + `/utils/${ctx}`);
  cloneMethod(origCore, destCtx + `/_self/core`);

  /** @type {string[]} */ const errors = [];
  imports.forEach((folder) => {
    let orig = origBase + `/imports/${ctx}/${folder}`;
    fileExists(orig) && cloneMethod(orig, destCtx + `/imports/${ctx}/${folder}`);
    orig = origBase + `/imports/core/${folder}`;
    fileExists(orig) ? cloneMethod(orig, destCtx + `/imports/core/${folder}`)
      : errors.push(`${ctx}-imports not found: ${orig}`);
  });
  errors.length && log.error(...errors);
};

/** @param {string} ctxArg */
const processContextArg = (ctxArg, dfault = '') => {
  let imports = getArgumentValue(ctxArg) ?? dfault;
  const addCtx = !['', 'null', 'false', '0', '!1'].includes(imports);
  if (['null', 'false', '0', '!1', 'true', '1', '!0'].includes(imports)) imports = '';
  addCtx && generateContext(ctxArg.replace(/-imports$/, ''), imports.split(',').filter(Boolean));
};

/**
Clones `view` dependencies into a generated `imported` subfolder, based on the argument value: default 'true'.
Public `view` dependencies must point to the `imported` subfolder, so they are available on the client side.
The value can also be a comma-separated list of additional modules from the `imports/view` context.
*/
processContextArg('view-imports', '1');

/**
Clones `drive` dependencies into a generated `imported` subfolder, based on the argument value: default 'false'.
Unlike `view`, the `drive` folder is not public and its dependencies can be referenced directly.
The value can also be a comma-separated list of additional modules from the `imports/drive` context.
*/
processContextArg('drive-imports');
