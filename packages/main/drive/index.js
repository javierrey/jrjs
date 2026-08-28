// main/drive/index.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/drive/cluster.js').ClusterConfig} ClusterConfig;
*/

import {
  log, driveHub, hydrate, jsonParse, jsonStringify,
} from '../../../../jrjs/packages/lib/drive/drive.js';
import { coreProps } from '../core/index.js';

const _fileurl = import.meta.url;
const distFolder = _fileurl.includes('/dist/') ? 'dist' : 'packages';
const appName = _fileurl.split('/').at(-3) ?? '';

const _inputarg = process.argv.slice(2).at(-1) || '{}';
const params = jsonParse(_inputarg) ?? {};

/** @type {PlainObject & ClusterConfig} */
const config = {
  distFolder,
  appName,
  clusterSize: 1, // 0, 1, 2, ... os.cpus().length
  base: '',
  apps: [
    {
      name: 'server',
      path: '../../../../jrjs/packages/lib/drive/server/run.js',
      primary: false,
      requires: [],
      state: {},
      config: {
        port: 3000,
        privateDir: '_ignore/store',
        publicDir: `${distFolder}/${appName}/view`,
        servicesDir: `${distFolder}/${appName}/drive/services`,
      },
    },
  ],
};

hydrate(driveHub, coreProps, config, params);

log.info(`hub: ${jsonStringify(driveHub, null, 2)}`);

import('../../../../jrjs/packages/lib/drive/run.js');

// @remove, test examples:
// http://localhost:3000/mathfun
// http://localhost:3000/load.html?content=./content/document.md
// http://localhost:3000/service-one?p1=v%201&p2=v%202
