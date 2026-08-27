// main/core/shared.js
// @ts-check

const __fileurl = import.meta.url;
const folderAtM3 = __fileurl.split('/').at(-3);
const appName = (folderAtM3 === '_self' ? __fileurl.split('/').at(-6) : folderAtM3) || 'main';

export const sharedConfig = {
  __fileurl,
  appName,
};
