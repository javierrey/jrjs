// main/drive/index.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/drive/cluster.js').ClusterConfig} ClusterConfig;
*/

import { log, coreHub, hydrate, jsonParse, jsonStringify,
  driveConfig,
} from '../../../../jrjs/packages/lib/drive/drive.js';
import { coreConfig } from '../core/index.js';

const distFolder = import.meta.url.includes('/dist/') ? 'dist' : 'packages';
const params = jsonParse(process.argv.slice(2).at(-1) || '{}');
const appName = coreConfig.appName || 'main';

/** @type {PlainObject & ClusterConfig} */
const config = {
  distFolder,
  clusterSize: 1, // 0, 1, 2, ... os.cpus().length
  base: '',
  coreHub,
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

hydrate(driveConfig, coreConfig, config, params);

log.info(`config: ${jsonStringify(driveConfig, null, 2)}`);

import('../../../../jrjs/packages/lib/drive/run.js');

// @remove, test examples:
// http://localhost:3000/mathfun
// http://localhost:3000/load.html?content=./content/document.md
// http://localhost:3000/service-one?p1=v%201&p2=v%202
