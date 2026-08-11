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

// Unlike view, sys modules do not need to be copied into the consumer's source.
const addSys = !!getArgumentValue('add-sys');

const viewImports = getArgumentValue('view-imports')?.split(',').filter(Boolean) ?? [];

const origCore = destBase + '/core'; // Local core source copied to the target folder.

const destView = destBase + '/view/imported';
removeDir(destView);

cloneMethod(origBase + '/lib/core', destView + '/lib/core');
cloneMethod(origBase + '/lib/view', destView + '/lib/view');
cloneMethod(origBase + '/utils/core', destView + '/utils/core');
cloneMethod(origBase + '/utils/view', destView + '/utils/view');
cloneMethod(origCore, destView + '/core');

viewImports.forEach((folder) => {
  let orig = origBase + '/imports/view/' + folder;
  fileExists(orig) && cloneMethod(orig, destView + '/imports/view/' + folder);
  orig = origBase + '/imports/core/' + folder;
  fileExists(orig) ? cloneMethod(orig, destView + '/imports/core/' + folder)
    : log.error(`view-imports not found: ${orig}`);
});

if (addSys) {
  const sysImports = getArgumentValue('sys-imports')?.split(',').filter(Boolean) ?? [];

  const destSys = destBase + '/sys/imported';
  removeDir(destSys);

  cloneMethod(origBase + '/lib/core', destSys + '/lib/core');
  cloneMethod(origBase + '/lib/sys', destSys + '/lib/sys');
  cloneMethod(origBase + '/utils/core', destSys + '/utils/core');
  cloneMethod(origBase + '/utils/sys', destSys + '/utils/sys');
  cloneMethod(origCore, destSys + '/core');

  sysImports.forEach((folder) => {
    let orig = origBase + '/imports/sys/' + folder;
    fileExists(orig) && cloneMethod(orig, destSys + '/imports/sys/' + folder);
    orig = origBase + '/imports/core/' + folder;
    fileExists(orig) ? cloneMethod(orig, destSys + '/imports/core/' + folder)
      : log.error(`sys-imports not found: ${orig}`);
  });
}
