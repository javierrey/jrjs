// main/core/index.js
// @ts-check

const DEPTH1 = -3, DEPTH2 = DEPTH1 - 3;
const _fileurl = import.meta.url;
const folders = _fileurl.split('/'), depthName = folders.at(DEPTH1);
const appName = (depthName === '_self' ? folders.at(DEPTH2) : depthName) || 'main';

export const coreConfig = {
  _fileurl,
  appName,
};
