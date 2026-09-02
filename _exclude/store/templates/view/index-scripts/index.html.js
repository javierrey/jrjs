// index-scripts/index.html.js
// @ts-check

import {
  contextHub, log, when, parseQuery, jsonStringify,
  ge, gt, qs, qa, appendHtml,
} from './imported/lib/view/view.js';
import './hub.js';

/* * */

when(() => document.body, () => { // log('ready!');
});

/* * */
