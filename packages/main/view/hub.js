// main/view/hub.js
// @ts-check

/**
@typedef {{
  moduleName: string;
  href: string;
  updated: number;
}} ViewConfig;
*/

import {
  contextHub, merge, parseQuery,
} from './imported/lib/view/view.js';
import { coreHub } from './imported/_self/core/hub.js';

const viewParams = parseQuery(location.search);
const moduleName = 'main'; // @define (not in filepath).

/** @type {ViewConfig} */
const viewHub = {
  moduleName,
  href: location.href,
  updated: Date.now(),
};

merge(contextHub, coreHub, viewHub, viewParams);
