// index-scripts/index.html.js
// @ts-check

import {
  log, when, parseQuery,
  ge, gt, qs, qa, appendHtml, viewConfig,
} from './imported/lib/view/view.js';
import './index.js';

/* * */

when(() => document.body, () => { // log('ready!');
});

/* * */
