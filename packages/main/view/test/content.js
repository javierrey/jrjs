// main/view/test/content.js
// _@ts-check

import {
  contextHub, log, when, jsonStringify, CSSUtil, getEnvironment,
  ge, gt, qs, qa, appendHtml,
} from '../hub.js';
when(() => document.body && CSSUtil.getCssVariable('--lib-view-md-css'))
.then(() => CSSUtil.setCssTheme(contextHub.theme))
.catch(() => {});

log(`content.js!`);
document.querySelector('.notes')?.append(`\ncontent.js!`);
