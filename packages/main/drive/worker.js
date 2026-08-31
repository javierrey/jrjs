// main/drive/worker.js
// @ts-check

import { driveHub, jsonParse } from '../../../../jrjs/packages/lib/drive/drive.js';

Object.assign(driveHub, jsonParse(String(process.env.DRIVE_HUB_JSON || '')) ?? {});

import('../../../../jrjs/packages/lib/drive/run.js');
