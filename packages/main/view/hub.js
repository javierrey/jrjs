// main/view/hub.js
// @ts-check

/**
@typedef {{
  moduleName: string;
  href: string;
  load: string;
  theme: string;
}} ViewConfig;
*/

import {
  contextHub, merge, hydrate, parseQuery,
} from './imported/lib/view/view.js';
import { coreHub } from './imported/_self/core/hub.js';

export * from './imported/lib/view/view.js';

const viewParams = parseQuery(location.search);
const moduleName = 'main'; // @define (not in filepath).

/** @type {ViewConfig} */
const viewHub = {
  moduleName,
  href: location.href,
  load: '',
  theme: '',
};

/** @type {Partial<ViewConfig>} */
const defaults = {
  load: './home.html',
  theme: 'light',
};

merge(contextHub, coreHub, viewHub);
hydrate(contextHub, viewParams, defaults);
