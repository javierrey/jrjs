// main/view/hub.js
// @ts-check

/**
@typedef {import('./imported/lib/view/view.js').Scalar} Scalar;
@typedef {import('./imported/lib/view/view.js').PlainObject} PlainObject;
@typedef {import('./imported/lib/view/view.js').ArrayObject} ArrayObject;
@typedef {import('./imported/lib/view/view.js').FunctionObject} FunctionObject;
@typedef {import('./imported/lib/view/view.js').ViewConfig} ViewConfig;
@typedef {ViewConfig & PlainObject & {
}} ViewHub;
*/

import {
  environ, hydrate,
} from './imported/lib/view/view.js';
import { coreHub } from './imported/main/core/hub.js';

export * from './imported/lib/view/view.js';

/** @type {Partial<ViewHub>} */
const defaults = {
  load: './home.html',
  locale: 'en-US',
  theme: 'light',
};

/** @type {Partial<ViewHub>} */
const viewHub = {
  moduleName: 'main', // @define (not in filepath).
};

hydrate(environ.hub, viewHub, coreHub, environ.args, defaults);
