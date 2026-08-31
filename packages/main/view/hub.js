// main/view/hub.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
@typedef {{
  moduleName: string,
  href: string,
  updated: number,
}} ViewConfig;
*/

import {
  log, coreHub, hydrate, parseQuery, jsonStringify,
} from './imported/lib/view/view.js';
import { coreProps } from './imported/_self/core/index.js';

const params = parseQuery(location.search);

/** @type {PlainObject & ViewConfig} */
const viewConfig = {
  moduleName: 'main',
  href: location.href,
  updated: Date.now(),
};

hydrate(coreHub, coreProps, viewConfig, params);

log.info(`hub: ${jsonStringify(coreHub, null, 2)}`);
