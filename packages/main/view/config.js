// main/view/config.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
*/

import { coreHub } from './imported/lib/core/core.js';
import { sharedConfig } from './imported/_self/core/shared.js';

 /** @type {PlainObject} */
export default {
  ...sharedConfig,
  href: location.href,
  coreHub,
};
