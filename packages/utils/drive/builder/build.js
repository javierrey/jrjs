// build.js
// _@ts-check

import { getArgumentValue, copyDir } from '../../../lib/drive/drive.js';
import { configMinify, minifyBuild } from './minify.js';

const buildMethod = getArgumentValue('method') === 'copy' ? copyDir : minifyBuild; // minify, copy

const packages = getArgumentValue('packages') || ''; // main, ...

buildMethod === minifyBuild && configMinify(getArgumentValue('config') || '{}');

packages.split(',').forEach((dir) => buildMethod('./packages/' + dir, './dist/' + dir));
