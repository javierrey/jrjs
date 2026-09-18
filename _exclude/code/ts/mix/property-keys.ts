/*
_exclude/.../property-keys.ts
update: 2026
author: javier.rey.eu@gmail.com
*/
// @ts-check

/* Types functionality: */

/**
Gets a property value in an unknown type object if present, or undefined otherwise.
Accepts a list of nested keys: `getProperty(obj, 'items', 0, 'title', 'en-US')`
*/
export const getProperty = (object: unknown, ...keys: PropertyKey[]) => {
  for (const key of keys) {
    if (!object || typeof object !== 'object' || !(key in object)) return undefined;
    object = (object as { [key in PropertyKey]: unknown })[key];
  }
  return object;
};

/** Object shape narrowed by a tuple of nested keys. Required by `hasProperty`. */
type NestedObject<PKA extends PropertyKey[]> =
  PKA extends [infer First extends PropertyKey, ...infer Rest extends PropertyKey[]]
  ? { [key in First]: Rest extends [] ? unknown : NestedObject<Rest> } : unknown;

/**
Asserts an unknown type object has a nested property key. Accepts a list of nested keys:
`hasProperty(obj, 'data', 'count') && typeof obj.data.count === 'number' && obj.data.count++`
*/
export const hasProperty =
  <PKA extends PropertyKey[]>(object: unknown, ...keys: PKA): object is NestedObject<PKA> => {
    for (const key of keys) {
      if (!object || typeof object !== 'object' || !(key in object)) return false;
      object = (object as { [key in PropertyKey]: unknown })[key];
    }
    return true;
  };

// Usage:

const obj: unknown = {
  user: { profile: { name: 'Joanne', tags: ['x', 'y'] } },
  data: { count: 0 },
};

getProperty(obj);                                          // { user: { profile: { ... } }, data: { count: 0 } }
getProperty(obj, 'data', 'count');                         // 0
getProperty(obj, 'missing');                               // undefined
getProperty(obj, 'user', 'profile', 'name');               // 'Joanne'
getProperty(obj, 'user', 'profile', 'age');                // undefined
getProperty(obj, 'user', 'missing', 'name');               // undefined
getProperty(obj, 'user', 'profile', 'tags', 1);            // 'y'
getProperty(obj, 'user', 'profile', 'tags', 1);            // 'y'
getProperty(obj, 'user', 'profile', 'tags', 2);            // undefined

hasProperty(obj);                                          // true
if (hasProperty(obj, 'data', 'count')) obj.data.count = 1; // true // narrowed to { data: { count: unknown } }
hasProperty(obj, 'user', 'profile', 'age');                // false
hasProperty(obj, 'user', 'profile', 'tags', 1);            // true
hasProperty(obj, 'user', 'profile', 'tags', 2);            // false
hasProperty(obj, 'user', 'missing', 'name');               // false
if (hasProperty(obj, 'user', 'profile', 'name')) {         // true
  obj.user.profile.name = 'Jo';                            // narrowed to { user: { profile: { name: unknown } } }
}
hasProperty(obj, 'data', 'count') && typeof obj.data.count === 'number' && obj.data.count++; // 2
