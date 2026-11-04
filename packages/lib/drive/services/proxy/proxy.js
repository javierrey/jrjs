// lib/drive/services/proxy/index.js
// @ts-check

import { Readable } from 'node:stream';

/**
@typedef {import('../../../core/core.js').Scalar} Scalar;
@typedef {import('../../../core/core.js').PlainObject} PlainObject;
@typedef {PlainObject | Uint8Array | string | Readable} FetchResponse
*/

/**
Requests a URL from the server and returns JSON, text, or binary content based on its content type.
Parameters are appended to the URL query; all other options are passed to fetch.
An optional `resolver` selects a response method such as `json` or `text`, or `body` for a stream.
HTML: `http://localhost:3000/proxy?url=https://example.com`
JSON: `http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/todos/1`
@param {string | URL} url @param {PlainObject} [options] @return {Promise<FetchResponse>} 
*/
const proxy = async (url, options = {}) => {
  url = new URL(url); let resolver = options.resolver; delete options.resolver;
  if (!options.signal) { options.signal = AbortSignal.timeout(50e3); }
  const { params, ...fetchOptions } = options;
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => url.searchParams.append(key, value));
  } else if (params) {
    for (const [key, value] of Object.entries(params)) {
      for (const item of Array.isArray(value) ? value : [value]) {
        if (item != null) { url.searchParams.append(key, String(item)); }
      }
    }
  }
  const response = await fetch(url, fetchOptions);
  if (!resolver) {
    const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() ?? '';
    resolver = contentType.endsWith('json') ? 'json' : 'text';
  }
  return resolver === 'body'
    ? response.body ? Readable.fromWeb(response.body) : Readable.from([])
    : /** @type {any} */ (response)[resolver]?.();
};

/** @param {PlainObject} [params] @return {Promise<FetchResponse>} */
export default async (params = {}) => {
  params.name ||= 'proxy';
  return await proxy(params.url, params.options);
};
