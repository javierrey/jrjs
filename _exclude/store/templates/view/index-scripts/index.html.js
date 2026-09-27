// index-scripts/index.html.js
// @ts-check

import {
  contextHub, log, when, parseArguments, jsonStringify,
  ge, gt, qs, qa, appendHtml,
} from './imported/lib/view/view.js';
import './hub.js';

/* * */

when(() => document.body).then(() => { // log('ready!');
});

/* * */
