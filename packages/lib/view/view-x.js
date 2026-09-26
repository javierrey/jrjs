// lib/view/view-x.js, DOM
// _@ts-check

/**
@typedef {import('./view.js').PlainObject} PlainObject;
@typedef {import('./view.js').ViewContext} ViewContext;
*/

import {
  getViewSizeType,
} from './view.js';

import {
  // 
} from '../core/core-x.js';

export * from './view.js';
export * from '../core/core-x.js';

/* * */

/** Returns a promised array of screen size types, based on the screen's width, height and pixel ratio. */
export const getScreenSizeTypes = async () => {
  const sizes = [], details = await window.getScreenDetails();
  for (const screen of details.screens) {
    const dpr = screen.devicePixelRatio || window.devicePixelRatio || 1;
    sizes.push(getViewSizeType(screen.width / dpr, screen.height / dpr));
  }
  return sizes;
};

/* * */
