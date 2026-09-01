// build.js
// _@ts-check

import { getArgumentValue, copyDir } from '../../../lib/drive/drive.js';
import { configMinify, minifyBuild } from './minify.js';

const buildMethod = getArgumentValue('method') === 'copy' ? copyDir : minifyBuild; // minify, copy

const dirs = getArgumentValue('dirs') || ''; // main/view, main/drive

buildMethod === minifyBuild && configMinify(getArgumentValue('config') || '{}');

dirs.split(',').forEach((dir) => buildMethod('./packages/' + dir, './dist/' + dir));
