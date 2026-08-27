// main/core/config/index.js
// @ts-check

const __fileurl = import.meta.url;
const DEPTH = 4, DIFF = 3, appFolder = __fileurl.split('/').at(-DEPTH);
const appName = (appFolder === '_self' ? __fileurl.split('/').at(-DEPTH - DIFF) : appFolder) || 'main';

export default {
  __fileurl,
  appName,
};
