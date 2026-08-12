// view/config.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
*/

import { sharedConfig } from './imported/core/shared.js';

 /** @type {PlainObject} */
export default {
  ...sharedConfig,
  dummy: 'Dummy value',
};
