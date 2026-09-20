// main/view/hub.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').Scalar} Scalar;
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
@typedef {import('./imported/lib/view/view.js').ArrayObject} ArrayObject;
@typedef {import('./imported/lib/view/view.js').FunctionObject} FunctionObject;
@typedef {import('./imported/lib/view/view.js').ViewConfig} ViewConfig;
*/

import {
  contextHub, merge, hydrate, parseQuery,
} from './imported/lib/view/view.js';
import { coreHub } from './imported/_self/core/hub.js';

export * from './imported/lib/view/view.js';

/** @type {Partial<ViewConfig> & PlainObject} */
const viewHub = {
  moduleName: 'main',// @define (not in filepath).
  href: location.href,
};

const viewParams = /** @type {typeof viewHub} */ (parseQuery(location.search) ?? {});

/** @type {typeof viewHub} */
const viewDefaults = {
  load: './home.html',
  locale: 'en-US',
  theme: 'light',
};

merge(contextHub, coreHub, viewHub);
hydrate(contextHub, viewParams, viewDefaults);
