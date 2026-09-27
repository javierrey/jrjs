// lib/drive/register.js
// @ts-check

import { registerHooks } from 'node:module';

/**
Used in package.json scripts as:
"node --import \"./packages/lib/drive/register.js?packages=jrjs\" --preserve-symlinks --preserve-symlinks-main"
*/

/**
Registers a module alias for a given package name at a given nested depth.
@param {string} name @param {number} depth
*/
const registerAlias = (name, depth) => {
  const rootUrl = new URL('../'.repeat(depth), import.meta.url), prefix = `${name}/`;
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (specifier.startsWith(prefix)) {
        return nextResolve(new URL(specifier.slice(prefix.length), rootUrl).href, context);
      }
      return nextResolve(specifier, context);
    },
  });
}

const currentDepth = 3; // @define current script nested level.
const packages = new URL(import.meta.url).searchParams.get('packages')?.split(',').filter(Boolean) ?? [];

packages.forEach((name) => registerAlias(name, currentDepth));
