// main/view/index.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
*/

import {
  log, viewHub, hydrate, parseQuery, jsonStringify,
} from './imported/lib/view/view.js';
import { coreProps } from './imported/_self/core/index.js';

const params = parseQuery(location.search);

 /** @type {PlainObject} */
const config = {
  href: location.href,
};

hydrate(viewHub, coreProps, config, params);

log.info(`hub: ${jsonStringify(viewHub, null, 2)}`);
