// _@ts-check // build.js

import { getArgumentValue, copyDir } from '../../../lib/drive/drive.js';
import { configMinify, buildMinify } from './minify.js';

const buildMethod = getArgumentValue('method') !== 'copy' ? buildMinify : copyDir; // minify, copy

const dirs = getArgumentValue('dirs') || ''; // main/view, main/drive

buildMethod === buildMinify && configMinify(getArgumentValue('config') || '{}');

dirs.split(',').forEach((dir) => buildMethod('./packages/' + dir, './dist/' + dir));
