// lib/drive/drive.js, NodeJS
// _@ts-check

/**
@typedef {import('../core/core.js').Scalar} Scalar;
@typedef {import('../core/core.js').PlainObject} PlainObject;
@typedef {typeof globalThis} DriveContext;
@typedef {string | Uint8Array | import('node:fs').ReadStream} FileStream;
@typedef {{
  url: string;
  type: string;
  size: number;
  content: FileStream | null;
  error: Error | null;
}} FileObject;
@typedef {{
  moduleName: string;
  distFolder: string;
  privateDir: string;
  publicDir: string;
  servicesDir: string;
  expose?: boolean;
}} DriveConfig;
*/

import fs from 'node:fs';
import pathmod from 'node:path';
import assert from 'node:assert';
import { spawn } from 'node:child_process';

import {
  log,
} from '../core/core.js';

export * as fs from 'node:fs';
export const fsP = fs.promises;
export * as pathmod from 'node:path';
export * from '../core/core.js';

/** Process Arguments functionality: */

/**
Get command line argument value by name, or undefined if not found.
Formats: `--name=value`, `-name=value`, `name=value`, `--name value`, `-name value`, `name`.
@param {string} name
*/
export const getArgumentValue = (name, args = process.argv.slice(2)) => {
  let arg = args.find((a) => new RegExp(`^-{0,2}${name}=`).test(a) && !name.includes('='));
  if (arg) return arg.slice(arg.indexOf('=') + 1).replace(/^"|"$/g, '');
  let argi = args.findIndex((a) => new RegExp(`^-{1,2}${name}$`).test(a));
  if (argi > -1) return argi < args.length - 1 && !args[argi + 1].startsWith('-') ? args[argi + 1] : '';
  return args.includes(name) ? name : undefined;
};

/** Test functionality: */

export const assertError = (a, b) => {
  try { assert.deepStrictEqual(a, b); } catch (error) { return error; }
  return null;
};

export const testStatus = { tests: 0, errors: 0 };

export const resetTests = () => { testStatus.tests = 0; testStatus.errors = 0; };

export const test = (desc, a, b) => {
  const error = assertError(a, b); testStatus.tests++; error && testStatus.errors++;
  const logArgs = [`TEST ${testStatus.tests} ${error ? 'KO' : 'OK'} `, desc];
  error ? log.error(...logArgs, error.message || error) : log.info(...logArgs);
  return !error;
};

/* * */

/**
Returns a file `stat` properties synchronously, or null if the file pathname does not exist.
`stat` methods: `isFile, isDirectory, isBlockDevice, isCharacterDevice, isFIFO, isSocket`.
*/
export const fileStat = (filename) => fs.existsSync(filename) ? fs.statSync(filename) : null;

/** Returns 1 if a file pathname is a file, -1 if it is a directory or other type, 0 if does not exist. */
export const fileExists = (filename) => !fs.existsSync(filename) ? 0 : fs.statSync(filename).isFile() ? 1 : -1;

/**
Returns the file size if a file pathname is a file (size >= 0),
-1 if it is a directory, -2 for other types and NaN if does not exist.
*/
export const fileSize = (filename) => {
  if (!fs.existsSync(filename)) { return NaN; }
  const stat = fs.statSync(filename);
  return stat.isFile() ? stat.size : stat.isDirectory() ? -1 : -2;
};

/** Returns the core path of a given path string. */
export const getPathCore = (path) => '/' + path.replace(/\\/g, '/').replace(/^(\.*\/)+/, '').replace(/\/$/, '') + '/';

/** Copy file asynchronously. */
export const copyFile = (file, orig, dest) => {
  file = file.replace(/\\/g, '/');
  const target = file.replace(getPathCore(orig), getPathCore(dest));
  fs.mkdirSync(target.slice(0, target.lastIndexOf('/') + 1), { recursive: true });
  fsP.copyFile(file, target);
};

/**
Iterable generator of all file paths in a folder recursively.
Usage: `for await (const file of getAllFiles('./folder')) { ... }`
*/
export const getAllFiles = async function* (folder) {
  folder = (folder.replace(/\\/g, '/') + '/').replace(/\/\/+/g, '/');
  const items = await fsP.readdir(folder, { withFileTypes: true });
  for (const item of items) {
    const path = (folder + item.name).replace(/\/\/+/g, '/');
    if (item.isDirectory()) {
      yield* getAllFiles(path);
    } else if (item.isSymbolicLink()) {
      const stat = fs.statSync(path);
      if (stat.isDirectory()) { yield* getAllFiles(path);
      } else if (stat.isFile()) { yield path; }
    } else if (item.isFile()) { yield path; }
  }
};

/** Removes a directory. */
export const removeDir = (dir) => fs.rmSync(dir, { recursive: true, force: true });

/** Copy directory asynchronously. */
export const copyDir = async (orig, dest) => { // log.info(`copyDir: "${orig}" > "${dest}"`);
  removeDir(dest);
  for await (const file of getAllFiles(orig)) {
    copyFile(file, orig, dest);
  }
};

/**
Creates a file object with a content fragment, from `offset` through `length`.
No `length` reads to the end. No `encoding` reads content bytes, 'utf-8' reads as text.
Returns a file object with `url`, `size`, `content` and `error` properties.
@param {string} url @param {string} encoding @param {number} offset @param {number} length
*/
export const readFile = async (url, encoding = '', offset = 0, length = NaN) => {
  let handle; const file = { url, size: NaN, content: null, error: null };
  const fileExists = (path) => !fs.existsSync(path) ? 0 : fs.statSync(path).isFile() ? 1 : -1;
  if (fileExists(url) !== 1) { file.error = { message: `not a content file "${url}"` }; return file; }
  try {
    handle = await fs.promises.open(url, 'r'); file.size = (await handle.stat()).size;
    const resolveIndex = (ind, len) => ind < 0 ? Math.max(0, len + ind) : Math.min(ind, len);
    let cursor = 0; offset = resolveIndex(offset, file.size); length ||= file.size - offset;
    const end = Math.min(offset + length, file.size), content = new Uint8Array(end - offset);
    while (cursor < content.length) {
      const { bytesRead } = await handle.read(content, cursor, content.length - cursor, offset + cursor);
      if (bytesRead) { cursor += bytesRead; } else { break; }
    }
    const bytesToString = (bytes, enc, bom) => new TextDecoder(enc, { ignoreBOM: !!bom }).decode(bytes);
    const subcontent = content.subarray(0, cursor);
    file.content = encoding ? bytesToString(subcontent, encoding, false) : subcontent;
  } catch (error) { file.error = error; } finally { await handle?.close(); }
  return file;
};

/**
Creates a file object with a readable stream content.
No `encoding` reads content bytes, 'utf-8' reads as text.
*/
export const readFileStream = async (url, encoding = '') => {
  const file = /** @type {FileObject} */ ({ url, size: fileSize(url), content: null, error: null });
  if (file.size > 0) file.content = fs.createReadStream(url, { encoding });
  else if (Object.is(file.size, 0)) file.content = new Uint8Array(0);
  else file.error = { message: `not a content file "${url}"` };
  return file;
};

/** Create a readable and writable stream for copying a file. */
export const copyFileStream = (filePath, uploadPath) => {
  const readable = fs.createReadStream(filePath);
  const writable = fs.createWriteStream(uploadPath);
  return readable.pipe(writable);
};

/** Create a symbolic link to a directory. */
export const symlinkDir = (source, target) => {
  source = pathmod.resolve(source); target = pathmod.resolve(target);
  fs.mkdirSync(pathmod.dirname(target), { recursive: true });
  fs.rmSync(target, { recursive: true, force: true });
  fs.symlink(source, target, 'dir', (err) => err && log.error('symlink error', err));
};

/** Attempt to get a valid distribution or development path. */
export const getDistPath = (path, target = 'dist', source = 'packages') => {
  path = path.replace(/\\/g, '/');
  if (!fileExists(path)) path = path.replace(new RegExp(`(^|/)${source}/`), `$1${target}/`);
  if (!fileExists(path)) path = path.replace(new RegExp(`(^|/)${target}/`), `$1${source}/`);
  return path;
};

/* * */

/**
Splits command line arguments, including the leading command.
Usage: `const [cmd, ...args] = splitCommandArguments('ping 8.8.8.8')`
*/
// export const splitCommandArguments = (input) => {
//   const args = [], re = /"[^"]*"|'[^']*'|\S+/g; let match;
//   while (match = re.exec(input)) { args.push(match[1] ?? match[2] ?? match[3]); }
//   return args;
// };
export const splitCommandArguments = (input) => 
  input.split(/["']?\s+["']?/).map((a) => a.replace(/^["']|["']$/g, '')).filter((a) => a.trim());

/**
Promised wrap of `child_process.spawn`.
Example: `const { stdout } = await spawnProm('ping', ['8.8.8.8'])`
*/
export const spawnProm = (cmd, args, opts = {}) =>
  new Promise((resolve) => {
    let stdout = '', stderr = '', error = null;
    const progress = opts.progress; delete opts.progress;
    const cp = spawn(cmd, args, opts);
    cp.stdout.on('data', (data) => {
      data = data.toString(); stdout += data; progress?.(data, null);
    });
    cp.stderr.on('data', (data) => {
      data = data.toString(); stderr += data; progress?.(null, data);
    });
    cp.on('error', (err) => { error = err; });
    cp.on('close', (code) => { resolve({ stdout, stderr, error, code }); });
  });

/**
Calls `spawnProm` from a full `exec` command line.
Example: `const { stdout } = await execProm('ping 8.8.8.8')`
*/
export const execProm = async (cmdLine, opts) => {
  const statements = cmdLine.split(/ [&|]+ /); let ret;
  for (const statement of statements) {
    const [cmd, ...args] = splitCommandArguments(statement); // console.log(` execProm ${cmd}`, args); // eslint-disable-line
    ret = await spawnProm(cmd, args, opts);
  }
  return ret;
};

/* * */
// var { stdout } = await spawnProm('ping', ['8.8.8.8']);
// var { stdout } = await execProm('ping 8.8.8.8', { progress: (out, err) => console.log(`progress:`, out, err) });
// console.log(` !!!!!!!!!`, stdout); // eslint-disable-line
