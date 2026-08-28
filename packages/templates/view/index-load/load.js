// index-load/load.js
// _@ts-check

const log = console.log; // eslint-disable-line
// core.js:
const expose = (props, env = globalThis) => Object.entries(props).forEach(([k, v]) => { env[k] = v; });
const when = (ready = () => true, run = () => {}) => new Promise((s) => {
  let l = 50; const m = l * 100, t = Date.now() + m * 10, d = () => (l = Math.min(l * 1.2, m));
  (function f() { ready() ? s(run()) : Date.now() > t ? s() : setTimeout(f, d()); })();
});
const parseKey = (key, ctx, dot) => {
  ctx ??= globalThis; dot ??= '.';
  if (typeof key === 'string') {
    if (!dot || !key.includes(dot)) return ctx[key];
    key = key.replace(/\[/g, dot).replace(/["'`\]]/g, '').split(dot); // .map((k) => k.trim()); // trim?
  }
  let value = !key[0] ? undefined : ctx;
  while (value != null && key[0]) value = value[key.shift()];
  return key.length ? undefined : value;
};
const parseValue = (value, ctx, dot) => {
  if (typeof value === 'string') {
    if (!isNaN(Number(value)) && value.trim() || value === 'NaN') return Number(value);
    if (isJso(value)) try { return JSON.parse(value); } catch {}
    if (isKey(value)) return parseKey(value, ctx, dot) ?? value;
  }
  return value;
};
const parseQuery = (query, options) => {
  const object = {}; let aux; query ??= {}; options ??= {};
  if (query.constructor === String) {
    aux = query.indexOf('#'); if (aux !== -1) { query = query.slice(0, aux); }
    query = query.slice(query.indexOf('?') + 1).trim();
    query = !query ? [] : query.split('&');
  } else if (!query.forEach) { return Object.assign(object, query); }
  query.forEach((item, ind) => {
    item = String(item ?? ''); aux = item.indexOf('=');
    const key = decodeURIComponent(item.substring(0, aux)).trim() || String(ind);
    const value = decodeURIComponent(item.slice(aux + 1)).trim();
    const pv = value[0] + value[1] + value.at(-1) === '${}';
    object[key] = pv ? parseValue(value.slice(2, -1), options.ctx, options.dot) : value;
  });
  return object;
};
const UrlFun = (() => {
  const typename = 'UrlFun';

  const DEFAULT_BASE = globalThis.location ?? 'file:///';

  const REBASE_DOC_RE = /(?<=["'`]|url\()(?:\.{1,2}\/|\/{1,2})(?![\\()[\]{}?*+|.,"'])[^ "'`)]*(?=["'`)])/gi;
  const REBASE_HTML_LINKS_RE = /(?<=(?:[\s:-](?:href|src|url)\s*[=(]\s*["']))[^"']*(?=["'])/gi;
  const REBASE_HTML_DOCS_RE = /(<(script|style)(?:\s[^>]*)?>)([\s\S]*?)(<\/\2>)/gi;

  const newUrl = (url = null, base = null) => new URL(url ?? '', base ?? DEFAULT_BASE);

  const rebaseUrl = (url, base = null) => newUrl(url ?? '', newUrl(base)).href;

  const rebaseDoc = (code, base = null) => code.replace(REBASE_DOC_RE, (m) => rebaseUrl(m, base));

  const rebaseHtml = (html, base = null) => html
    .replace(REBASE_HTML_LINKS_RE, (m) => rebaseUrl(m, base))
    .replace(REBASE_HTML_DOCS_RE, (_m, a, _b, c, d) => a + rebaseDoc(c, base) + d);

  const closeDirUrl = (url) => {
    const path = UrlFun.newUrl(url).pathname;
    return path.endsWith('/') || /\.[^/]*$/.test(path) ? url : url.replace(/([?#]|$)/, '/$1');
  };

  return Object.freeze({ typename, newUrl, rebaseUrl, rebaseDoc, rebaseHtml, closeDirUrl }); // static
})();
const callFetch = (url, callback = null, resolver = null, options = null) => {
  let content, error;
  return fetch(url, options ?? {})
    .then((response) => {
      if (!response.ok) throw Error(`${response.status} ${response.statusText}`);
      return response[resolver ?? 'text']?.();
    })
    .then((cont) => (content = cont))
    .catch((err) => (error = err))
    .finally(() => callback?.(url, content, error));
};
  // from marked.js, nano-markdown.js
// import { mdToHtml } from '../../../../../servers/lib/view/lib/modules/md-html.js';
// import { mdToHtml } from '../../../../../_exclude/md-html/nano-md/md2html_1_wip.js';
const mdToHtml = (() => {
  let inCode = 0; const HD = 16, CH = '\\[!]#{()}*+-._',
  SE ='script|style|pre|code', SE0 = new RegExp(`<(${SE})[ >]`, 'i'), SE1 = new RegExp(`<\\/(${SE})>`, 'i'),
  RE1 = /^\s{0,3}(\#{1,6})\s+(.*?)\s*#*\s*$/, RE2 = /^\s*<[^>]+(?:>\s*<)?[^>]+>\s*$/,
  RE3 = /^(\s*)(?:[-*]|(\d+[.)])) (.+)$/, RE4 = /^\s{0,3}([-])(\s*\1){2,}\s*$/,
  RE5 = /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/,
  start = (t) => t.replace(/\\([-(){}[\]#*+.!_\\])/g,
    (_a, b, _c, d) => String.fromCharCode(1, CH.indexOf(b) + d)
  ).replace(/(\*\*|__|~~)(\S(?:[\s\S]*?\S)?)\1/g,
    (_a, b, c) => '~~' === b ? '<del>' + c + '</del>' : '<b>' + c + '</b>'
  ).replace(/(^|\W)([_*])(\S(?:[\s\S]*?\S)?)\2(\W|$)/g,
    (_a, b, _c, d, e) => b + '<i>' + d + '</i>' + e
  ).replace(/(!?)\[([^\]<>]+)\]\((\+?)([^ )<>]+)(?: "([^()"]+)")?\)/g, (_a, b, c, d, e, f) => {
    let h = f ? ' title="' + f + '"' : '';
    return b ? '<img src="' + main.href(e) + '" alt="' + c + '"' + h + '/>' : (d && (h += ' target="_blank"'),
      '<a href="' + main.href(e) + '"' + h + '>' + c + '</a>');
  }),
  finish = (t) => t.replace(/\x01([\x0f-\x1c])/g, (_a, b) => CH[b.charCodeAt(0) - HD])
    .replace(/<p>\s*(?=<\/)(?!<\/p>)/gi, ''),
  split = (t) => t.replace(/\\\|/g, '\x00').replace(/^\s*\||\|\s*$/g, '').split('|')
    .map((a) => a.trim().replace(/\x00/g, '|')),
  table = (t) => {
    const h = split(t[0]), b = t.slice(2).map(split), c = (a, d) => `<${a}>` + finish(start(d)) + `</${a}>`;
    return '<table><thead><tr>' + h.map((a) => c('th', a)).join('') + '</tr></thead>'
      + '<tbody>' + b.map((a) => '<tr>' + a.map((d) => c('td', d)).join('') + '</tr>').join('')
      + '</tbody></table>';
  },
  task = (p, t) => {
    const m = /^ *\[( |x|X)\]\s+([\s\S]*)$/.exec(t);
    if (m && p.startsWith('>')) { p = ' style="list-style:none;padding-left:1rem;"' + p; }
    return m ? p + '<input type="checkbox" disabled style="cursor:default;"'
      + (m[1].trim() ? ' checked' : '') + '/> ' + m[2] : p + t;
  },
  main = (t) => (t || '').replace(/\r\n?/g, '\n').replace(/.+(?:\n.+)*/g, (a) => {
    const s0 = SE0.test(a), s1 = SE1.test(a); if (s1) inCode = 0; else if (s0) inCode = 1;
    const g = []; let d = null;
    if (inCode) {
      if (/^\s*```\s*$/.test(a)) return inCode = 0, '</code></pre>';
      d = /^([\s\S]*?)\n\s*```\s*$/.exec(a);
      return d ? (inCode = 0, d[1] + '</code></pre>') : a.replace(/<\/?p>/gi, '');
    } else {
      if (d = /^\s*```[^\n]*\n([\s\S]*?)\n\s*```\s*$/.exec(a)) return '<pre><code>' + d[1] + '</code></pre>';
      if (d = /^\s*```[^\n]*(?:\n([\s\S]*))?$/.exec(a)) return inCode = 1, '<pre><code>' + (d[1] ?? '');
    }
    if (!inCode && !s0) a = a.replace(/(`)([^`]*)\1/g, '<code>$2</code>');
    for (let f, h = start(a).split('\n'), i = 0; i < h.length; i++) {
      const k = h[i], u = RE2.test(k), p = u || inCode || (s0 && s1) ? '' : 'p'; let m = RE1.exec(k);
      if (!m) {
        if (/\|/.test(k) && RE5.test(h[i + 1] ?? '')) {
          const j = [k, h[++i]];
          while (/\|/.test(h[i + 1] ?? '')) j.push(h[++i]);
          g.push(f = [table(j), '', '']);
        } else (m = RE3.exec(k)) ? g.push(f = [m[3], m[2] ? 'ol' : 'ul', m[1].length])
          : RE4.test(k) ? g.push(f = ['', 'hr']) : f && 'hr' !== f[1] && 'h' !== f[1] ? f[0] += '\n' + k
          : g.push(f = [k, p, '']);
      } else { g.push(f = [m[2], 'h', m[1].length]); }
    }
    const o = []; let n = '';
    for (let i = 0; i < g.length; i++) {
      const f = g[i], q = f[0], r = f[1], s = f[2];
      if ('ul' === r || 'ol' === r) {
        while (o.length && s < o.at(-1)[1]) n += '</li></' + o.pop()[0] + '>';
        if (!o.length || s > o.at(-1)[1]) { o.push([r, s]); n += '<' + r + task('><li>', q);
        } else if (r !== o.at(-1)[0]) {
          n += '</li></' + o.pop()[0] + '>'; o.push([r, s]); n += '<' + r + task('><li>', q);
        } else n += '</li><li>' + task('', q);
      } else {
        while (o.length) n += '</li></' + o.pop()[0] + '>';
        if (q?.trim()) {
          if (r) n += 'hr' === r ? '<hr/>' : '<' + r + s + main.headAttrs(s, q) + '>' + q + '</' + r + s + '>';
          else n += q;
        }
      }
    }
    while (o.length) n += '</li></' + o.pop()[0] + '>';
    return finish(n);
  });
  return main.href = (a) => a, main.headAttrs = (_a, _b) => '', main;
})();
// view.js:
const ge = (id) => document.getElementById(id);
const gt = (tag, el = document) => el?.getElementsByTagName?.(tag);
const qs = (sel, el = document) => { try { return el?.querySelector?.(sel); } catch {} };
const qa = (sel, el = document) => { try { return el?.querySelectorAll?.(sel); } catch {} };
const appendHtml = (el, html) => el?.insertAdjacentHTML?.('beforeend', html);
const loadScript = (src, code = null, type = null) => {
  const script = document.createElement('script');
  script.type = type ?? 'application/javascript';
  src ? (script.src = src) : (script.textContent = code ?? '');
  document.head.appendChild(script); script.remove();
  return script;
};
const insertHtml = (html, parent = null, position = null, norun = false) => {
  html = ((doc) => {
    const ind = doc.search(/<\/head>/i); if (ind < 1) return doc;
    const div = document.createElement('div');
    div.insertAdjacentHTML('beforeend', doc.slice(0, ind));
    div.replaceChildren(...div.querySelectorAll('script, style, link'));
    div.insertAdjacentHTML('beforeend', doc.slice(ind));
    return div.innerHTML;
  })(html ?? '');
  parent = (typeof parent === 'string' ? qs(parent) : parent) ?? document.body;
  position = position === 'all' ? '' : position ?? 'beforeend';
  const getScripts = norun ? (_) => [] : (el) => [...el.getElementsByTagName('script')];
  const scripts = getScripts(parent);
  position ? parent.insertAdjacentHTML(position, html) : (parent.innerHTML = html);
  getScripts(parent).forEach(
    (script) => !scripts.includes(script) && loadScript(script.src, script.textContent, script.type)
  );
};
const loadHtml = (url, parent = null, position = null, norun = false) => {
  const cb = (uri, cont, err) => {
    uri = UrlFun.closeDirUrl(uri);
    cont ??= '', cont = `\n<!--loadHtml "${uri}" "${cont.length}B" "${err ?? ''}"-->\n`
      + UrlFun.rebaseHtml(/\.md([?#]|$)/i.test(uri) ? mdToHtml(cont) : cont, uri)
      + `\n<!--/loadHtml-->\n`;
    insertHtml(cont, parent, position, norun);
  };
  callFetch(url, cb, 'text');
};
const viewHub = {
  content: parseQuery(location.search).content || '',
};
// globalize:
expose({ log, expose, when, loadHtml, viewHub });
