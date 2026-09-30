// utils/drive/builder/build.js
// _@ts-check

import { environ, copyDir } from '../../../lib/drive/drive.js';
import { configMinify, minifyBuild } from './minify.js';

const buildMethod = environ.args.method === 'copy' ? copyDir : minifyBuild; // minify, copy

const packages = environ.args.packages || ''; // main, ...

buildMethod === minifyBuild && configMinify(environ.args.config || '{}');

packages.split(',').forEach((dir) => buildMethod('./packages/' + dir, './dist/' + dir));
