// prebuild.js
// @ts-check

import {
  getArgumentValue,
  fileExists,
  copyDir,
  log,
  removeDir,
  symlinkDir
} from '../../../lib/sys/sys.js';

const cloneMethod = getArgumentValue('method') !== 'copy' ? symlinkDir : copyDir; // symlink, copy

const origBase = getArgumentValue('orig') || 'packages';
const destBase = getArgumentValue('dest') || 'packages/main';
const origCore = destBase + '/core'; // Local core source copied to the target folder.

/** @param {string} ctx @param {string[]} imports */
const processContext = (ctx, imports = []) => {
  const destCtx = destBase + `/${ctx}/imported`;
  removeDir(destCtx);

  cloneMethod(origBase + '/lib/core', destCtx + '/lib/core');
  cloneMethod(origBase + `/lib/${ctx}`, destCtx + `/lib/${ctx}`);
  cloneMethod(origBase + '/utils/core', destCtx + '/utils/core');
  cloneMethod(origBase + `/utils/${ctx}`, destCtx + `/utils/${ctx}`);
  cloneMethod(origCore, destCtx + '/core');

  imports.forEach((folder) => {
    let orig = origBase + `/imports/${ctx}/${folder}`;
    fileExists(orig) && cloneMethod(orig, destCtx + `/imports/${ctx}/${folder}`);
    orig = origBase + `/imports/core/${folder}`;
    fileExists(orig) ? cloneMethod(orig, destCtx + `/imports/core/${folder}`)
      : log.error(`${ctx}-imports not found: ${orig}`);
  });
}

/** Client `view` dependency links point to the generated `imported` folder. */
let viewImportsArg = getArgumentValue('view-imports') ?? '';
const addView = viewImportsArg && !['false', '0', '!1', 'null'].includes(viewImportsArg);
if (['true', 'false', '1', '0', '!0', '!1', 'null'].includes(viewImportsArg)) viewImportsArg = '';
addView && processContext('view', viewImportsArg.split(',').filter(Boolean));

/**
Use only if `sys` dependency links point to the generated `imported` folder.
Unlike `view`, `sys` modules do not need to be copied into the consumer's source.
*/
let sysImportsArg = getArgumentValue('sys-imports') ?? '';
const addSys = sysImportsArg && !['false', '0', '!1', 'null'].includes(sysImportsArg);
if (['true', 'false', '1', '0', '!0', '!1', 'null'].includes(sysImportsArg)) sysImportsArg = '';
addSys && processContext('sys', sysImportsArg.split(',').filter(Boolean));
