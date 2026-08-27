// main/view/config/index.js
// @ts-check

/**
@typedef {import('../imported/lib/view/view.js').PlainObject} PlainObject;
*/

import { coreHub } from '../imported/lib/core/core.js';
import coreConfig from '../imported/_self/core/config/index.js';

 /** @type {PlainObject} */
export default {
  ...coreConfig,
  href: location.href,
  coreHub,
};
