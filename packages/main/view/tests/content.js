// main/view/test/content.js
// _@ts-check

import {
  environ, log, when, jsonStringify, CSSUtils,
  ge, gt, qs, qa, appendHtml,
} from '../hub.js';
when(() => document.body && CSSUtils.getCssVariable('--lib-view-md-css'))
.then(() => CSSUtils.setCssTheme(environ.hub.theme))
.catch(() => {});

log(`content.js!`);
document.querySelector('.notes')?.append(`\ncontent.js!`);
