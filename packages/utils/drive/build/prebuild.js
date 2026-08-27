// prebuild.js
// @ts-check

import {
  log,
  getArgumentValue, fileExists,
  removeDir, copyDir, symlinkDir
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

  imports.forEach((folder) => {
    let orig = origBase + `/imports/${ctx}/${folder}`;
    fileExists(orig) && cloneMethod(orig, destCtx + `/imports/${ctx}/${folder}`);
    orig = origBase + `/imports/core/${folder}`;
    fileExists(orig) ? cloneMethod(orig, destCtx + `/imports/core/${folder}`)
      : log.error(`${ctx}-imports not found: ${orig}`);
  });
}

/** @param {string} ctxArg */
const processContextArg = (ctxArg) => {
  let imports = getArgumentValue(ctxArg) ?? '';
  const addCtx = imports && !['false', '0', '!1', 'null'].includes(imports);
  if (['false', '0', '!1', 'null', 'true', '1', '!0'].includes(imports)) imports = '';
  addCtx && generateContext(ctxArg.replace(/-imports$/, ''), imports.split(',').filter(Boolean));
};

/** Client `view` dependency links point to the generated `imported` folder. */
processContextArg('view-imports');

/**
This argument should only be set if `drive` dependency links point to the generated `imported` folder.
Unlike `view`, `drive` modules do not need to be copied into the consumer's source.
*/
processContextArg('drive-imports');
