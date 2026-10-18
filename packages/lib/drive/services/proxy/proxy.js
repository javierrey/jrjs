// lib/drive/services/proxy/index.js
// @ts-check

/**
@typedef {import('../../../core/core.js').Scalar} Scalar;
@typedef {import('../../../core/core.js').PlainObject} PlainObject;
@typedef {PlainObject | Uint8Array | string} FetchResponse
*/

/**
Requests a URL from the server and returns JSON, text, or binary content based on its content type.
Parameters are appended to the URL query; all other options are passed to fetch.
HTML: `http://localhost:3000/proxy?url=https://example.com`
JSON: `http://localhost:3000/proxy?url=https://jsonplaceholder.typicode.com/todos/1`
@param {string | URL} url @param {PlainObject} [options] @return {Promise<FetchResponse>} 
*/
const proxy = async (url, options = {}) => {
  const target = new URL(url);
  const { params, ...fetchOptions } = options;
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => target.searchParams.append(key, value));
  } else if (params) {
    for (const [key, value] of Object.entries(params)) {
      for (const item of Array.isArray(value) ? value : [value]) {
        if (item != null) { target.searchParams.append(key, String(item)); }
      }
    }
  }
  const response = await fetch(target, fetchOptions);
  const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() ?? '';
  if (contentType.endsWith('json')) { return response.json(); }
  if (['text/javascript', 'application/javascript', 'application/ecmascript'].includes(contentType)) {
    const text = await response.text();
    try { return JSON.parse(text); } catch { return text; }
  }
  if (!contentType || contentType.startsWith('text/') || contentType.endsWith('+xml') || [
    'application/xml', 'application/xhtml+xml', 'application/x-www-form-urlencoded',
  ].includes(contentType)) { return response.text(); }
  return new Uint8Array(await response.arrayBuffer());
};

/** @param {PlainObject} [params] @return {Promise<FetchResponse>} */
export default async (params = {}) => {
  params.name ||= 'proxy';
  return await proxy(params.url, params.options);
};
