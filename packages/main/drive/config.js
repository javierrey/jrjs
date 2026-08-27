// main/drive/config.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/drive/drive.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/drive/cluster.js').ClusterConfig} ClusterConfig;
*/

import { sharedConfig } from '../core/shared.js';

const distFolder = import.meta.url.includes('/dist/') ? 'dist' : 'packages';
const appName = sharedConfig.appName || 'main';

/** @type {PlainObject & ClusterConfig} */
export default {
  ...sharedConfig,
  distFolder,
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

// @remove, test examples:
// http://localhost:3000/mathfun
// http://localhost:3000/load.html?content=./content/document.md
// http://localhost:3000/service-one?p1=v%201&p2=v%202
