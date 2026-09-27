// utils/drive/builder/build.js
// _@ts-check

import { envInfo, copyDir } from '../../../lib/drive/drive.js';
import { configMinify, minifyBuild } from './minify.js';

const buildMethod = envInfo.args.method === 'copy' ? copyDir : minifyBuild; // minify, copy

const packages = envInfo.args.packages || ''; // main, ...

buildMethod === minifyBuild && configMinify(envInfo.args.config || '{}');

packages.split(',').forEach((dir) => buildMethod('./packages/' + dir, './dist/' + dir));
