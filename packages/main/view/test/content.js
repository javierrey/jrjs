// main/view/test/content.js
// _@ts-check

import {
  contextHub, log, when, jsonStringify, CSSUtils, getEnvironment,
  ge, gt, qs, qa, appendHtml,
} from '../hub.js';
when(() => document.body && CSSUtils.getCssVariable('--lib-view-md-css'))
.then(() => CSSUtils.setCssTheme(contextHub.theme))
.catch(() => {});

log(`content.js!`);
document.querySelector('.notes')?.append(`\ncontent.js!`);
