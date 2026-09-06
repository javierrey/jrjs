const fs = require('fs');
const CleanCSS = require('./index.js');

const log = console.log; // eslint-disable-line

const fsP = fs.promises;

const minify_css = CleanCSS.process;

const argv = process.argv.slice(2);

// Ported from lib jrjs:
const parseObject = (json) => {
  try { json = (new Function(`return ${json}`))(); } catch { json = undefined; }
  return json;
};

(async (filePath = '', optJson = '') => {
  let code = '', opt = {};
  try {
    code = await fsP.readFile(filePath, 'utf8');
    opt = parseObject(optJson) ?? {};
  } catch {}
  const minified = await minify_css(code, opt);
  log(minified.css);
})(...argv);
