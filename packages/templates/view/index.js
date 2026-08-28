// main/view/index.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
*/

import {
  log, coreHub, hydrate,
  parseQuery, jsonStringify, viewConfig,
} from './imported/lib/view/view.js';
import { coreConfig } from './imported/_self/core/index.js';

const params = parseQuery(location.search);

 /** @type {PlainObject} */
const config = {
  href: location.href,
  coreHub,
};

hydrate(viewConfig, coreConfig, config, params);

log.info(`config: ${jsonStringify(viewConfig, null, 2)}`);
