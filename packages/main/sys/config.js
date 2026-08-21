// sys/config.js
// @ts-check

/**
@typedef {import('../../../../jrjs/packages/lib/sys/sys.js').PlainObject} PlainObject;
@typedef {import('../../../../jrjs/packages/lib/sys/cluster.js').ClusterConfig} ClusterConfig;
*/

import { sharedConfig } from '../core/shared.js';

const distFolder = import.meta.url.includes('/dist/') ? 'dist' : 'packages';

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
        publicDir: `${distFolder}/main/view`,
        privateDir: '_ignore/store',
        serviceDir: `${distFolder}/main/sys/services`,
      },
    },
  ],
};

// http://localhost:3000
// http://localhost:3000/index-load.html
// http://localhost:3000/mathfun
