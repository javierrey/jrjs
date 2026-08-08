// prebuild.js
// @ts-check

import {
  getArgumentValue, fileExists, copyDir, symlinkDir,
} from '../../../lib/sys/sys.js';

const cloneMethod = getArgumentValue('method') === 'symlink' ? symlinkDir : copyDir; // copy, symlink

const origBase = getArgumentValue('orig') || 'packages';
const destBase = getArgumentValue('dest') || 'packages/sample';

// Unlike view, sys modules do need to be copied into the consumer source (sys-related params commented out).

const importsToView = getArgumentValue('imports-view')?.split(',').filter(Boolean) ?? [];
// const importsToSys = getArgumentValue('imports-sys')?.split(',').filter(Boolean) ?? [];

const destView = destBase + '/view/jrjs';
// const destSys = destBase + '/sys/jrjs';

cloneMethod(origBase + '/lib/core', destView + '/lib/core');
cloneMethod(origBase + '/lib/view', destView + '/lib/view');
cloneMethod(origBase + '/utils/core', destView + '/utils/core');
cloneMethod(origBase + '/utils/view', destView + '/utils/view');

// cloneMethod(origBase + '/lib/core', destSys + '/lib/core');
// cloneMethod(origBase + '/lib/sys', destSys + '/lib/sys');
// cloneMethod(origBase + '/utils/core', destSys + '/utils/core');
// cloneMethod(origBase + '/utils/sys', destSys + '/utils/sys');

importsToView.forEach((folder) => {
  let orig = origBase + '/imports/view/' + folder;
  fileExists(orig) && cloneMethod(orig, destView + '/imports/view/' + folder);
  orig = origBase + '/imports/core/' + folder;
  fileExists(orig) && cloneMethod(orig, destView + '/imports/core/' + folder);
});

// importsToSys.forEach((folder) => {
//   let orig = origBase + '/imports/sys/' + folder;
//   fileExists(orig) && cloneMethod(orig, destSys + '/imports/sys/' + folder);
//   orig = origBase + '/imports/core/' + folder;
//   fileExists(orig) && cloneMethod(orig, destSys + '/imports/core/' + folder);
// });
