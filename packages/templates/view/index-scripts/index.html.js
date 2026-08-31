// index-scripts/index.html.js
// @ts-check

import {
  log, when, parseQuery,
  ge, gt, qs, qa, appendHtml, coreHub,
} from './imported/lib/view/view.js';
import './hub.js';

/* * */

when(() => document.body, () => { // log('ready!');
});

/* * */
