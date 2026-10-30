// server.js // javier.rey.eu@gmail.com // 2026
// Portable standalone server: static files, runnable services and a URL proxy.
// Usage: `node ./server.js --port=55555 --publicDir=./view --servicesDir=./services --log=false`
// http://localhost:55555/proxy?url="https://query1.finance.yahoo.com/v8/finance/chart/REL.L?range=2y&interval=1d"
// _@ts-check

import http from 'node:http';
import fs from 'node:fs';
import pathmod from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath, pathToFileURL } from 'node:url';

const log = console.log;

const toBoolean = (v) => !!v &&
  !/^(|0|!1|f(alse)?|n(ull|an|[o/].*)?|undef(ined)?|disabled?|off|-|''|""|\[]|{})$/i.test(v.trim?.() ?? 1);

const baseDir = pathmod.dirname(fileURLToPath(import.meta.url));

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, value = 'true'] = arg.replace(/^--?/, '').split(/=(.*)/s, 2);
  return [key, value];
}));

const options = {
  port: Number(args.port) || NaN,
  publicDir: args.publicDir || null,
  servicesDir: args.servicesDir || null,
  log: toBoolean(args.log),
};

const config = {
  host: '0.0.0.0',
  port: 55555,
  publicDir: './view',
  servicesDir: './services',
  indexFile: 'index.html',
  serviceFile: 'index.js',
  proxyRoute: '/proxy',
  timeout: 50e3,
  uploadLimit: 8e6,
  log: false,
};

Object.entries(options).forEach(
  ([key, value]) => {
    if (value != null && value !== '' && !Number.isNaN(value)) { config[key] = value; }
  }
);

const publicRoot = pathmod.resolve(baseDir, config.publicDir);
const servicesRoot = pathmod.resolve(baseDir, config.servicesDir);

/* content types: */

const EXT_TYPES = {
  html: 'text/html', htm: 'text/html', js: 'application/javascript', mjs: 'application/javascript',
  cjs: 'application/javascript', css: 'text/css', json: 'application/json', json5: 'application/json',
  md: 'text/markdown', xml: 'application/xml', xhtml: 'application/xhtml+xml', yaml: 'application/yaml',
  yml: 'application/yaml', csv: 'text/csv', txt: 'text/plain', log: 'text/plain', vtt: 'text/vtt',
  svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', ico: 'image/x-icon', mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav',
  weba: 'audio/webm', mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', woff: 'font/woff',
  woff2: 'font/woff2', ttf: 'font/ttf', gltf: 'model/gltf+json', glb: 'model/gltf-binary', stl: 'model/stl',
  pdf: 'application/pdf', zip: 'application/zip', gz: 'application/gzip', wasm: 'application/wasm',
};

const MAGIC_TYPES = [
  ['image/png', [0x89, 0x50, 0x4e, 0x47]], ['image/jpeg', [0xff, 0xd8, 0xff]], ['image/gif', [0x47, 0x49, 0x46]],
  ['application/pdf', [0x25, 0x50, 0x44, 0x46]], ['application/zip', [0x50, 0x4b, 0x03, 0x04]],
  ['application/gzip', [0x1f, 0x8b]], ['application/wasm', [0x00, 0x61, 0x73, 0x6d]],
];

const typeByExt = (file) => EXT_TYPES[pathmod.extname(file).slice(1).toLowerCase()];

const isJsonText = (text) => { try { JSON.parse(text); return true; } catch { return false; } };

const sniffType = (content) => {
  if (content == null) { return 'text/plain'; }
  if (content instanceof Uint8Array) {
    const magic = MAGIC_TYPES.find(([, sig]) => sig.every((byte, i) => content[i] === byte));
    if (magic) { return magic[0]; }
    const head = Buffer.from(content.subarray(0, 12)).toString('latin1');
    if (head.startsWith('RIFF') && head.slice(8) === 'WEBP') { return 'image/webp'; }
    return content.subarray(0, 512).includes(0)
      ? 'application/octet-stream' : sniffType(Buffer.from(content).toString());
  }
  if (typeof content === 'object') { return 'application/json'; }
  const text = String(content).trimStart();
  return /^<svg[\s>]/i.test(text) ? 'image/svg+xml'
    : text.startsWith('<?xml') ? 'application/xml'
    : text.startsWith('<') ? 'text/html'
    : /^[{[]/.test(text) && isJsonText(text) ? 'application/json'
    : 'text/plain';
};

const withCharset = (type) =>
  /^text\/|json|javascript|xml|yaml/.test(type) && !/charset=/i.test(type) ? `${type}; charset=utf-8` : type;

/* helpers: */

const statOf = (file) => { try { return fs.statSync(file); } catch { return null; } };

const safeJoin = (root, urlPath) => {
  const target = pathmod.join(root, pathmod.normalize('/' + urlPath));
  return target === root || target.startsWith(root + pathmod.sep) ? target : null;
};

const readHead = (file, size = 512) => {
  const fd = fs.openSync(file, 'r'), buf = Buffer.alloc(size);
  try { return buf.subarray(0, fs.readSync(fd, buf, 0, size, 0)); } finally { fs.closeSync(fd); }
};

const httpError = (status, message) => Object.assign(new Error(message), { status });

const toBuffer = (body) =>
  body == null ? Buffer.alloc(0)
  : body instanceof Uint8Array ? body
  : body instanceof ArrayBuffer ? Buffer.from(body)
  : Buffer.from(typeof body === 'object' ? JSON.stringify(body) : String(body));

const readPayload = (req) => new Promise((resolve, reject) => {
  if (req.method === 'GET' || req.method === 'HEAD') { return resolve(''); }
  const chunks = []; let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > config.uploadLimit) { req.destroy(); reject(httpError(413, 'payload too large')); }
    else { chunks.push(chunk); }
  });
  req.on('end', () => resolve(Buffer.concat(chunks).toString())).on('error', reject);
});

/* responders: */

const send = (req, res, status, body, type) => {
  const ctype = res.getHeader('content-type') ?? type ?? sniffType(body);
  res.setHeader('content-type', withCharset(String(ctype)));
  if (body?.pipe) {
    res.writeHead(status);
    if (req.method === 'HEAD') { body.destroy?.(); return res.end(); }
    return body.on('error', (error) => res.destroy(error)).pipe(res);
  }
  const data = toBuffer(body);
  res.writeHead(status, { 'content-length': data.length });
  res.end(req.method === 'HEAD' ? undefined : data);
};

const sendFile = (req, res, file, stat) => {
  const headers = {
    'content-type': withCharset(typeByExt(file) ?? sniffType(readHead(file))), 'accept-ranges': 'bytes',
  };
  const range = /^bytes=(\d*)-(\d*)$/i.exec(req.headers.range ?? '');
  let start = 0, end = stat.size - 1, status = 200;
  if (range && (range[1] || range[2])) {
    start = range[1] ? Number(range[1]) : Math.max(stat.size - Number(range[2]), 0);
    end = range[1] && range[2] ? Math.min(Number(range[2]), end) : end;
    if (start > end) {
      res.writeHead(416, { ...headers, 'content-range': `bytes */${stat.size}` });
      return res.end();
    }
    status = 206; headers['content-range'] = `bytes ${start}-${end}/${stat.size}`;
  }
  res.writeHead(status, { ...headers, 'content-length': Math.max(end - start + 1, 0) });
  if (req.method === 'HEAD' || stat.size === 0) { return res.end(); }
  fs.createReadStream(file, { start, end }).on('error', (error) => res.destroy(error)).pipe(res);
};

/* services: */

const proxy = async (params) => {
  if (!params.url) { throw httpError(400, 'missing "url" parameter'); }
  let target;
  try { target = new URL(params.url); } catch { throw httpError(400, 'invalid url'); }
  if (!/^https?:$/.test(target.protocol)) { throw httpError(400, 'only http(s) urls are allowed'); }
  const upstream = await fetch(target, { signal: AbortSignal.timeout(config.timeout) });
  return {
    status: upstream.status,
    type: upstream.headers.get('content-type') ?? 'application/octet-stream',
    body: upstream.body ? Readable.fromWeb(upstream.body) : null,
  };
};

// Quoted values take the raw query up to their closing quote, so they don't need encoding.
const quotedUrlParams = (query) => {
  if (!/=("|'|%22|%27)/i.test(query)) { return Object.fromEntries(new URLSearchParams(query)); }
  const quoted = {}, plain = []; let rest = query.replace(/^\?/, '');
  while (rest) {
    const amp = rest.indexOf('&'), eq = rest.indexOf('=');
    const open = eq > -1 && (amp < 0 || eq < amp) ? /^("|'|%22|%27)/i.exec(rest.slice(eq + 1)) : null;
    if (!open) {
      plain.push(amp < 0 ? rest : rest.slice(0, amp)); rest = amp < 0 ? '' : rest.slice(amp + 1);
      continue;
    }
    const start = eq + 1 + open[0].length, close = /^("|%22)$/i.test(open[1]) ? /"|%22/i : /'|%27/i;
    const closed = close.exec(rest.slice(start)), end = closed ? start + closed.index : rest.length;
    quoted[decodeURIComponent(rest.slice(0, eq))] = rest.slice(start, end);
    const next = closed ? rest.indexOf('&', end + closed[0].length) : -1;
    rest = next < 0 ? '' : rest.slice(next + 1);
  }
  return { ...Object.fromEntries(new URLSearchParams(plain.join('&'))), ...quoted };
};

const findService = (pathname) => {
  const base = safeJoin(servicesRoot, pathname);
  if (!base) { return null; }
  const candidates = pathname.endsWith('/')
    ? [pathmod.join(base, config.serviceFile)] : [`${base}.js`, pathmod.join(base, config.serviceFile)];
  return candidates.find((file) => statOf(file)?.isFile()) ?? null;
};

const runService = async (file, params, req, res) => {
  const { mtimeMs } = statOf(file);
  const { default: service } = await import(`${pathToFileURL(file).href}?v=${mtimeMs}`);
  if (typeof service !== 'function') { throw httpError(500, 'service has no default export function'); }
  return service(params, req, res);
};

/* server: */

const handler = async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost'); let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { return send(req, res, 400, 'bad request', 'text/plain'); }
  const params = { ...Object.fromEntries(url.searchParams), payload: await readPayload(req) };

  if (pathname.replace(/\/$/, '') === config.proxyRoute) {
    const { status, type, body } = await proxy(quotedUrlParams(url.search));
    return send(req, res, status, body, type ?? undefined);
  }

  const publicPath = safeJoin(publicRoot, pathname), stat = publicPath ? statOf(publicPath) : null;
  if (stat?.isFile()) { return sendFile(req, res, publicPath, stat); }
  if (stat?.isDirectory()) {
    if (!url.pathname.endsWith('/')) {
      res.writeHead(308, { location: `${url.pathname}/${url.search}` });
      return res.end();
    }
    const indexPath = pathmod.join(publicPath, config.indexFile), indexStat = statOf(indexPath);
    if (indexStat?.isFile()) { return sendFile(req, res, indexPath, indexStat); }
  }

  const serviceFile = findService(pathname);
  if (serviceFile) {
    const result = await runService(serviceFile, params, req, res);
    return res.headersSent || res.writableEnded ? undefined : send(req, res, 200, result);
  }

  pathname === '/favicon.ico'
    ? send(req, res, 204, null, 'text/plain') : send(req, res, 404, 'not found', 'text/plain');
};

const server = http.createServer(async (req, res) => {
  if (config.log) {
    res.on('finish', () => log(`${new Date().toISOString()} ${req.method} ${req.url} ${res.statusCode}`));
  }
  try { await handler(req, res); } catch (error) {
    if (config.log && !(error.status < 500)) { console.error(error); }
    if (res.headersSent) { return res.destroy(); }
    const status = error.status ?? (error.code === 'ENOENT' ? 404 : 500);
    send(req, res, status, error.message ?? 'server error', 'text/plain');
  }
});

server.timeout = config.timeout;
server.listen(config.port, config.host, () => {
  log(`Server listening on http://${config.host}:${config.port}`);
  log(`Public "${publicRoot}", services "${servicesRoot}"`);
});
