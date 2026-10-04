// lib/view/view-x.js, DOM
// _@ts-check

/**
@typedef {import('./view.js').PlainObject} PlainObject;
@typedef {import('./view.js').ViewContext} ViewContext;
*/

import {
  getViewSizeRank,
} from './view.js';

import {
  // 
} from '../core/core-x.js';

export * from './view.js';
export * from '../core/core-x.js';

/* * */

/** Returns a promised array of screen size ranks, based on the screen's width and height. */
export const getScreenSizeRank = async () => {
  const sizes = [], details = await window.getScreenDetails();
  for (const screen of details.screens) {
    sizes.push(getViewSizeRank(screen.width, screen.height));
  }
  return sizes;
};

/* * */
