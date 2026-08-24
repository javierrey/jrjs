/*
_exclude/.../property-keys.ts
update: 2026
author: javier.rey.eu@gmail.com
*/
// @ts-check

/* Types functionality: */

/**
Gets a property value in an unknown type object if present, or undefined otherwise.
Accepts a list of nested keys: `getProperty(object, 'items', 0, 'title', 'en-US')`
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
`if (hasProperty(object, 'data', 'count')) { object.data.count = 1; }`
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

const data: unknown = {
  user: { profile: { name: 'Ana', tags: ['x', 'y'] } },
  count: 0,
};

getProperty(data);                                  // { ...data }
getProperty(data, 'count');                         // 0
getProperty(data, 'missing');                       // undefined
getProperty(data, 'user', 'profile', 'name');       // 'Ana'
getProperty(data, 'user', 'profile', 'age');        // undefined
getProperty(data, 'user', 'settings', 'name');      // undefined
getProperty(data, 'user', 'profile', 'tags', 1);    // 'y'

hasProperty(data);                                  // true
if (hasProperty(data, 'count')) data.count = 1;     // true // narrowed to { count: unknown }
hasProperty(data, 'user', 'profile', 'age');        // false
hasProperty(data, 'user', 'settings', 'name');      // false
hasProperty(data, 'user', 'profile', 'tags', 1);    // true
if (hasProperty(data, 'user', 'profile', 'name')) { // true
  data.user.profile.name = 'Jo';                    // narrowed to { user: { profile: { name: unknown } } }
}
