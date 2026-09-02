// main/view/hub.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
@typedef {{
  moduleName: string,
  href: string,
  updated: number,
}} ViewHub;
*/

import {
  contextHub, hydrate, parseQuery,
} from './imported/lib/view/view.js';
import { coreHub } from './imported/_self/core/hub.js';

const viewParams = parseQuery(location.search);

/** @type {PlainObject & ViewHub} */
const viewHub = {
  moduleName: 'main',
  href: location.href,
  updated: Date.now(),
};

hydrate(contextHub, coreHub, viewHub, viewParams);
