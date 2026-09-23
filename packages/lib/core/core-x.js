// lib/core/core-x.js
// _@ts-check

/**
@typedef {import('./core.js').PlainObject} PlainObject;
@typedef {string | Uint8Array | ReadableStream<Uint8Array>} ContentStream;
@typedef {{
  url: string;
  type: string;
  size: number;
  content: ContentStream | null;
  error: Error | null;
}} ContentObject;
*/

import {
  isBin, isTra, toEmp, toSca, toStr, REX,
} from './core.js';

export * from './core.js';

/* Types functionality: */

/* String and RegExp transformations: */

/** Extends REX definition. */
export const REX_X = (() => {
  const typename = 'REX_X';

  /** RegExp for a decimal number. */
  const DECIMAL_NUMBER_RE = /[+-]?(?:\d+\.?\d*|\d*\.?\d+)(?:[eE][+-]?\d+)?/g;

  /**
  Gets a RegExp for a decimal number that is not part of a word,
  including optional character prefixes.
  */
  const getDecimalNumberInContextRE = (chars = '') => new RegExp(
    `[+-]?(?<=^|[^\\w${chars}])(?:\\d+\\.?\\d*|\\d*\\.?\\d+)(?:[eE][+-]?\\d+)?(?=[^\\w]|$)`, 'g'
  );

  /** Trims all lines in a text. */
  const trimLines = (text) => text.replace(/\s*\n\s*/g, '\n').trim();

  /** Removes empty lines and multiple spaces. */
  const removeEmptySpaces = (text) => text.replace(/\s*\n+\s*/g, '\n').replace(/(\n|\s){2,}/g, '$1').trim();

  /** constructor method */
  const main = (text) => Object.freeze({
    ...REX(text),
    trimLines: () => trimLines(text),
    removeEmptySpaces: () => removeEmptySpaces(text),
  });

  /** public static members */
  const members = {
    ...REX, typename,
    DECIMAL_NUMBER_RE, getDecimalNumberInContextRE,
    // Also implemented in instance version:
    trimLines, removeEmptySpaces,
  };

  return Object.freeze(Object.assign(main, members));
})();



/**
Returns a random string of a certain length.
Default `length`: 11, `base`: 36, which generates an alphanumeric output in a single seed iteration.
Useful `base` alphabet sets: 2 (binary), 10 (decimal), 16 (hexadecimal), 36 (alphanumeric).
*/
export const getRandomString = (length = 11, base = 36) => {
  let str = ''; while (str.length < length) str += Math.random().toString(base).slice(2);
  return str.slice(-length);
};

/* Object transformations and String parsers: */

/**
Clones a plain object or array recursively. Other object types are assigned by reference.
Same as method `clone`, but the behaviour is configurable and avoids cyclic redundancy.
Returns a cloned object, or the object itself if it is not clonable.
The `opt` parameter can be null or an array with property names and object references
that will be treated as direct values, rather than traversed recursively.
To create a shallow copy of the source object, use `Object.assign` instead.
*/
export const customClone = (opt, obj) => {
  const isObj = (v) => !!v && [Object, undefined].includes(v.constructor);
  const isTra = (v) => isObj(v) || !!(v?.every?.(isObj) && v.length);
  const map = (v) => typeof v?.slice === 'function' && !v.substring ? v.slice() : v;
  if (!isTra(obj)) { return map(obj); }
  const x = {
    keys: new Set(opt?.filter((v) => v?.constructor === String) || []),
    refs: new WeakSet(opt?.filter((v) => isTra(v)) || []),
  };
  const had = (v, k) => { const h = x.refs.has(v) || x.keys.has(k); x.refs.add(v); return h; };
  const emp = (v) => typeof v?.join === 'function' ? [] : {};
  const travel = (t, s) => Object.entries(s).forEach(([k, v]) => {
    if (isTra(v) && !had(v, k)) { t[k] = emp(v); travel(t[k], v); }
    else if (v === obj) { t[k] = tgt; } else if (v === s) { t[k] = t; } else { t[k] = map(v); }
  });
  const tgt = emp(obj); had(obj); had(globalThis); travel(tgt, obj);
  return tgt;
};

/**
Remaps an object or array recursively calling a mapping function on each non-traversable property.
Same as method `remap`, but the behaviour is configurable and avoids cyclic redundancy.
The `opt` parameter can be null or an array with property names and object references
that will be treated as direct values, rather than traversed recursively.
The `map` function parameter performs a mapping operation on each non-traversable property.
It must accept a parent object and a property key. It doesn't need to return anything.
To prevent the mutation of the orignal object, use a clone: `customRemap(null, customClone(null, obj), map)`.
*/
export const customRemap = (opt, obj, map) => {
  const isObj = (v) => !!v && [Object, undefined].includes(v.constructor);
  const isTra = (v) => isObj(v) || !!(v?.every?.(isObj) && v.length);
  const x = {
    keys: new Set(opt?.filter((v) => v?.constructor === String) || []),
    refs: new WeakSet(opt?.filter((v) => isTra(v)) || []),
  };
  const had = (v, k) => { const h = x.refs.has(v) || x.keys.has(k); x.refs.add(v); return h; };
  const travel = (o) => Object.entries(o)
    .forEach(([k, v]) => isTra(v) ? !had(v, k) && travel(v) : map(o, k, obj));
  if (map instanceof Function && isTra(obj)) { had(obj); had(globalThis); travel(obj); }
  return obj;
};

/**
Updates the content of a target object with properties from one or more source objects recursively.
Same as method `merge`, but the behaviour is configurable and avoids cyclic redundancy.
Both target and source parameters should be plain objects.
The `opt` parameter can be null or an object with `mode` and `exclude` options.
The `mode` option may be: 0 (`clean`), 1 (`assign`), 2 (`overwrite`) and 3 (`extend`).
The `clean` mode modifies existing properties and creates new properties in the target,
but also removes properties, when the matching property name in the source has value `undefined`.
The `assign` mode does the same as `clean`, but doesn't remove properties from the target.
The `overwrite` mode can update target properties but cannot create new ones.
The `extend` mode can create new properties in the target but cannot modify existing defined values.
The `exclude` option array may contain property names and object references that will be treated as direct
values, rather than traversed recursively.
e.g. `const mergeFunc = (tgt, ...srcs) => customMerge({ mode: 1, exclude: ['parent', this] }, tgt, ...srcs);`
To prevent the mutation of the orignal target, use a clone: `customMerge(null, customClone(null, tgt), ...srcs);`.
*/
export const customMerge = (opt, tgt, ...srcs) => {
  if (typeof opt === 'number') { opt = { mode: opt }; } else { opt ??= {}; }
  const set = opt.mode === 3 ? (o, k, v) => { o[k] === undefined && (o[k] = v); }
    : opt.mode === 2 ? (o, k, v) => { k in o && (o[k] = v); }
    : opt.mode === 1 ? (o, k, v) => { o[k] = v; }
    : (o, k, v) => { v === undefined ? delete o[k] : (o[k] = v); };
  const isObj = (v) => !!v && [Object, undefined].includes(v.constructor);
  const travs = (o, k, v) => isObj(o[k]) && isObj(v);
  const x = {
    keys: new Set(opt.exclude?.filter((v) => v?.constructor === String) || []),
    refs: new WeakSet(opt.exclude?.filter((v) => isObj(v)) || []),
  };
  const had = (v, k) => { const h = x.refs.has(v) || x.keys.has(k); x.refs.add(v); return h; };
  const travel = (t, s) => s !== t && Object.entries(s)
    .forEach(([k, v]) => travs(t, k, v) && !had(v, k) ? travel(t[k], v) : set(t, k, v));
  tgt = Object.assign(tgt ?? {}); had(tgt); had(globalThis);
  srcs.forEach((src) => { src = Object.assign(src ?? {}); had(src); travel(tgt, src); });
  return tgt;
};

/**
Creates a serializable clone of an object, where cyclic redundancy is prevented
by replacing redundant values with path references to existing properties.
Scalable types are cast to scalar values.
@todo serializable
*/
export const serializable = (source) => {
  if (!isTra(source)) { return toSca(source); }
  const target = toEmp(source), path = ['@root'];
  const ex = new WeakMap([[source, path]]);
  const traverse = (s, t, p) => {
    Object.keys(s).forEach((k) => {
      const v = s[k];
      if (isTra(v)) {
        const kp = p.concat(k);
        if (!ex.has(v)) {
          ex.set(v, kp); t[k] = toEmp(v); traverse(v, t[k], kp);
        } else { t[k] = ex.get(v); }
      } else { t[k] = toSca(v); }
    });
  };
  traverse(source, target, path);
  return target;
};

/**
Creates a deserializable object generated with `serializable`.
The process is not strictly symetric to `serializable`, as `isSca` is used for values
that can be cast to scalars.
@todo deserializable
*/
export const deserializable = (source) => {
  if (!isTra(source)) { return toSca(source); }
  const target = toEmp(source);
  const isReference = (v) => v?.[0] === '@root';
  const getReference = (v) => { const a = v.slice(1); return a.reduce((acc, cur) => acc[cur], source); };
  const getValue = (v) => isReference(v) ? getReference(v) : v;
  const ex = new WeakSet([source]);
  const traverse = (s, t) => {
    Object.keys(s).forEach((k) => {
      const v = getValue(s[k]);
      if (isTra(v)) {
        if (!ex.has(v)) {
          ex.add(v);
          t[k] = toEmp(v);
          traverse(v, t[k]);
        } else {
          t[k] = v === s ? t : Object.assign(toEmp(v), v);
        }
      } else { t[k] = toSca(v); }
    });
  };
  traverse(source, target);
  return target;
};

/** Serializes an object into a JSON string. */
export const serialize = (obj) => JSON.stringify(serializable(obj));

/** Deserializes a JSON string into an object. */
export const deserialize = (str) => deserializable(JSON.parse(str));

/** Converts a JSON string into YAML text. */
export const jsonToYaml = (json) => {
  if (typeof json === 'string') { try { json = JSON.parse(json); } catch { return ''; } };
  const scalar = (v) => {
    if (v === null) { return 'null'; }
    if (typeof v !== 'string') { return String(v); }
    const trimmed = v.trim();
    const plain = trimmed && trimmed === v && !/[\r\n\0]/.test(v)
      && !/^[\-?:,\[\]{}#&*!|>'"%@`]/.test(v) && !/(^|\s)[#]|:\s/.test(v)
      && !/^(?:null|true|false|yes|no|on|off|\.nan|[+-]?\.inf)$/i.test(v)
      && !/^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(v);
    if (/[\x00-\x1f\x7f-\x9f]/.test(v) || v.includes("'")) { return JSON.stringify(v); }
    if (v.includes('\\') || v.includes('"')) { return `'${v}'`; }
    if (plain) { return v; }
    return `'${v.replaceAll("'", "''")}'`;
  };
  const write = (v, level) => {
    if (v === null || typeof v !== 'object') { return scalar(v); }
    const indent = '  '.repeat(level);
    if (!Object.keys(v).length) { return Array.isArray(v) ? '[]' : '{}'; }
    const isBlock = (item) => item !== null && typeof item === 'object' && Object.keys(item).length;
    return Array.isArray(v)
      ? v.map((item) => isBlock(item)
        ? `${indent}-\n${write(item, level + 1)}`
        : `${indent}- ${write(item, level + 1)}`).join('\n')
      : Object.entries(v).map(([key, item]) => {
        const prefix = `${indent}${scalar(key)}:`;
        return isBlock(item)
          ? `${prefix}\n${write(item, level + 1)}`
          : `${prefix} ${write(item, level + 1)}`;
      }).join('\n');
  };
  return write(json, 0);
};

/** Converts YAML text into a JSON-compatible value. */
export const yamlToJson = (yaml) => {
  if (typeof yaml !== 'string') { return null; }
  const invalid = Symbol('invalid-yaml');
  const removeComment = (line) => {
    let quote = '', escaped = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (quote === '"' && char === '\\' && !escaped) { escaped = true; continue; }
      if (char === quote && !escaped) { quote = ''; }
      else if (!quote && (char === '"' || char === "'")) { quote = char; }
      else if (!quote && char === '#' && (!i || /\s/.test(line[i - 1]))) { return line.slice(0, i); }
      escaped = false;
    }
    return line;
  };
  const lines = yaml.replace(/\r\n?/g, '\n').split('\n').map(removeComment)
    .filter((line) => line.trim() && !/^\s*(?:---|\.\.\.)\s*$/.test(line));
  const scalar = (text) => {
    const value = text.trim();
    if (!value) { return null; }
    if (value === '{}' || value === '[]') { return value === '{}' ? {} : []; }
    if (/^[\[{]/.test(value)) { return invalid; }
    if (value[0] === "'") {
      if (value.at(-1) !== "'") { return invalid; }
      return value.slice(1, -1).replaceAll("''", "'");
    }
    if (value[0] === '"') {
      try { return JSON.parse(value); } catch { return invalid; }
    }
    if (/^(?:null|~)$/i.test(value)) { return null; }
    if (/^(?:true|false)$/i.test(value)) { return value.toLowerCase() === 'true'; }
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) { return Number(value); }
    return value;
  };
  const containsInvalid = (value) => value === invalid
    || Array.isArray(value) && value.some(containsInvalid)
    || value && typeof value === 'object' && (Object.values(value).some(containsInvalid)
    || Object.getOwnPropertySymbols(value).some((key) => key === invalid));
  const getKeyIndex = (text) => {
    let quote = '', escaped = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (quote === '"' && char === '\\' && !escaped) { escaped = true; continue; }
      if (char === quote && !escaped) { quote = ''; }
      else if (!quote && (char === '"' || char === "'")) { quote = char; }
      else if (!quote && char === ':' && (!text[i + 1] || /\s/.test(text[i + 1]))) { return i; }
      escaped = false;
    }
    return -1;
  };
  const parse = (start, indent) => {
    const first = lines[start];
    const content = first.slice(indent);
    if (content === '{}' || content === '[]') { return { value: scalar(content), index: start + 1 }; }
    const array = content.startsWith('-') && (!content[1] || /\s/.test(content[1]));
    const result = array ? [] : {};
    let index = start;
    while (index < lines.length) {
      const line = lines[index];
      const lineIndent = line.match(/^ */)[0].length;
      if (lineIndent < indent) { break; }
      if (lineIndent !== indent) { return { value: invalid, index: lines.length }; }
      const current = line.slice(indent);
      if (array) {
        if (!current.startsWith('-') || (current[1] && !/\s/.test(current[1]))) { break; }
        const value = current.slice(1).trim();
        const separator = getKeyIndex(value);
        if (separator >= 0) {
          const item = {}, key = scalar(value.slice(0, separator));
          const itemValue = value.slice(separator + 1).trim();
          if (itemValue) { item[key] = scalar(itemValue); index++; }
          else if (lines[index + 1] && lines[index + 1].match(/^ */)[0].length > indent) {
            const childIndent = lines[index + 1].match(/^ */)[0].length;
            const child = parse(index + 1, childIndent); item[key] = child.value; index = child.index;
          } else { item[key] = null; index++; }
          result.push(item);
        } else if (value) { result.push(scalar(value)); index++; }
        else if (lines[index + 1] && lines[index + 1].match(/^ */)[0].length > indent) {
          const childIndent = lines[index + 1].match(/^ */)[0].length;
          const child = parse(index + 1, childIndent); result.push(child.value); index = child.index;
        } else { result.push(null); index++; }
      } else {
        const separator = getKeyIndex(current);
        if (separator < 0) {
          if (!lines[index + 1] || lines[index + 1].match(/^ */)[0].length <= indent) {
            return { value: invalid, index: lines.length };
          }
          const childIndent = lines[index + 1].match(/^ */)[0].length;
          const child = parse(index + 1, childIndent); result[current.trim()] = child.value;
          index = child.index; continue;
        }
        const key = scalar(current.slice(0, separator));
        const value = current.slice(separator + 1).trim();
        if (value) { result[key] = scalar(value); index++; }
        else if (lines[index + 1] && lines[index + 1].match(/^ */)[0].length > indent) {
          const childIndent = lines[index + 1].match(/^ */)[0].length;
          const child = parse(index + 1, childIndent); result[key] = child.value; index = child.index;
        } else { result[key] = null; index++; }
      }
    }
    return { value: result, index };
  };
  try {
    if (!lines.length) { return null; }
    const indent = lines[0].match(/^ */)[0].length;
    const root = lines[0].slice(indent).trim();
    if (lines.length === 1 && (root === '{}' || root === '[]' || getKeyIndex(root) < 0)) {
      const value = scalar(root); return containsInvalid(value) ? null : value;
    }
    const result = parse(0, indent);
    if (result.index !== lines.length || containsInvalid(result.value)) { return null; }
    return result.value;
  } catch { return null; }
};

/** Remove all own properties of an object. */
export const emptyObject = (obj) => Object.keys(obj).forEach((k) => delete obj[k]);

/** Assign readonly properties to a target object from a source object. */
export const assignReadonly = (t, s) => Object.entries(s).forEach(([k, v]) =>
  Object.defineProperty(t, k, { value: v, enumerable: true, writable: false })) ?? t;

/* Arrays and iterables: */

/* URL and path functionality: */

/* Content string functionality: */

/** Appends content to an HTML string container and returns the result string. */
export const appendHTMLContent = (parent, content, tag) => {
  let end = -1;
  if (tag) {
    end = parent.lastIndexOf('<!--/' + tag + '-->');
    if (end === -1) { end = parent.lastIndexOf('</' + tag + '>'); }
  }
  if (end === -1) { end = parent.lastIndexOf('</'); }
  if (end === -1) { end = parent.length; }
  return parent.slice(0, end) + content + parent.slice(end);
};

/* Flow and event functionality: */

/** Clear timeouts and/or intervals. */
export const clearTimeouts = (...skip) => {
  let tid = 1 + (+setTimeout(() => {}));
  const timeout = !skip.includes('timeout'), interval = !skip.includes('interval');
  while (tid--) if (!skip.includes(tid)) { timeout && clearTimeout(tid); interval && clearInterval(tid); }
};

/**
Fetches a URL resource with options and a callback function. Returns a stateful request container.
@param {string | URL | RequestInit | Record<string, unknown>} url
@param {RequestInit | Record<string, unknown> | Function} options
@return {Promise<Response>}
Usage examples:
`const result = await fetchRequest('data/url.json');`
`fetchRequest('data/url.json', (req) => console.log(req));`
`fetchRequest('data/url.json', { headers: {}, body: {}, callback: (req) => {}});`
`fetchRequest({ url: 'data/url.json', headers: {}, body: {}, callback: (req) => {}});`
*/
export const fetchRequest = (url, options = {}) => {
  if ([String, URL].includes(url?.constructor)) {
    options = typeof options === 'function' ? { callback: options } : Object.assign({}, options);
  } else { options = Object.assign({}, url); url = options.url ?? ''; delete options.url; }
  const contentType = 'content-type', jsonKey = 'application/json', text = 'text', resolvers = {
    [jsonKey]: 'json', 'multipart/': 'formData',
    'text/': text, 'application/javascript': text, 'application/xml': text, 'model/': text,
    'image/': 'blob', 'video/': 'blob', 'audio/': 'blob', 'font/': 'blob', 
    'application/': 'arrayBuffer',
  }, resolverKeys = Object.keys(resolvers);
  const callback = options.callback; delete options.callback;
  const timeout = Number(options.timeout) || 50e3; delete options.timeout;
  const abortController = new AbortController(); options.signal = abortController.signal;
  options.headers ??= {}; options.method ??= !options.body ? 'get' : 'post';
  options.cache ??= 'no-cache'; options.mode ??= undefined;
  if (options.body) {
    if (!options.headers.get || !options.headers.set) {
      Object.defineProperty(options.headers, 'get', { enumerable: false });
      options.headers.get = (k) => options.headers[k];
      Object.defineProperty(options.headers, 'set', { enumerable: false });
      options.headers.set = (k, v) => { options.headers[k] = v; };
    }
    !options.headers.get(contentType) && options.headers.set(contentType, jsonKey);
    if (options.headers.get(contentType) === jsonKey) {
      if (options.body.forEach) { // FormData
        const body = {};
        options.body.forEach((v, k) => {
          if (k in body) { if (!body[k]?.push) body[k] = [body[k]]; body[k].push(v); } else { body[k] = v; }
        });
        options.body = body;
      } else if ([Object, undefined].includes(options.body.constructor)) {
        options.body = JSON.stringify(options.body);
      }
    }
  }
  const getHeadersObj = (h = {}) => h.entries ? Object.fromEntries(h.entries()) : h;
  const getHeaderKeys = (h = {}) => h.entries ? Array.from(h.keys()) : Object.keys(h);
  const request = {
    url, method: options.method, time: Date.now(), duration: NaN, aborted: 0,
    requestHeaderKeys: getHeaderKeys(options.headers), hasRequestBody: !!options.body,
    error: null, result: null, responseHeaders: {}, response: null,
    abort: (code = NaN) => { abortController.abort(); request.aborted ||= code || 1; },
  };
  const tId = setTimeout(() => request.abort(-1), timeout);
  const resolver = (response, type) => {
    const method = resolvers[resolverKeys.find((k) => type?.includes(k))] || text;
    return response?.[method]();
  };
  const processor = () => {
    clearTimeout(tId); request.duration = Date.now() - request.time; callback?.(request);
  };
  return fetch(url, options)
    .then((response) => {
      request.response = response; request.responseHeaders = getHeadersObj(response.headers);
      if (!response.ok) { throw new Error(`[${response.status}] ${response.statusText}`); }
      return resolver(response, request.responseHeaders[contentType]);
    })
    .then((result) => (request.result = result))
    .catch((error) => (request.error = error))
    .finally(processor);
};

/** Fetches a URL resource and returns a file object with a readable Web stream. */
export const readStream = async (url, options = {}) => {
  /** @type {ContentObject} */ const file = { url, type: '', size: NaN, content: null, error: null };
  try {
    const response = await fetch(url, options);
    if (!response.ok) { throw new Error(`${response.status} ${response.statusText}`); }
    file.type = response.headers.get('content-type') ?? '';
    const size = response.headers.get('content-length');
    file.size = size === null ? NaN : Number(size);
    file.content = response.body;
  } catch (error) { file.error = error; }
  return file;
};

/* * */
