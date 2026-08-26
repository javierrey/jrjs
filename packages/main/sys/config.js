// main/sys/config.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/sys/sys.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/sys/cluster.js').ClusterConfig} ClusterConfig;
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
      path: '../../../../jrjs/packages/lib/sys/server/run.js',
      primary: false,
      requires: [],
      state: {},
      config: {
        port: 3000,
        privateDir: '_ignore/store',
        publicDir: `${distFolder}/${appName}/view`,
        serviceDir: `${distFolder}/${appName}/sys/services`,
      },
    },
  ],
};

// http://localhost:3000
// http://localhost:3000/content.html
// http://localhost:3000/mathfun
