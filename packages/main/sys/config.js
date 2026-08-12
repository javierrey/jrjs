// sys/config.js
// @ts-check

/**
@typedef {import('../../lib/sys/sys.js').PlainObject} PlainObject;
@typedef {import('../../lib/sys/cluster.js').ClusterConfig} ClusterConfig;
*/

import { sharedConfig } from '../core/shared.js';

const distFolder = import.meta.url.replace(/\\/g, '/').includes('/dist/') ? 'dist' : 'packages';

/** @type {PlainObject & ClusterConfig} */
export default {
  ...sharedConfig,
  distFolder,
  clusterSize: 1, // 0, 1, 2, ... os.cpus().length
  base: '',
  apps: [
    {
      name: 'server',
      path: '../../lib/sys/server/run.js',
      primary: false,
      requires: [],
      state: {},
      config: {
        port: 3000,
        publicDir: `${distFolder}/main/view`,
        privateDir: '_ignore/store',
      },
    },
  ],
};

// @remove test examples:
// http://localhost:3000
// http://localhost:3000/imported/utils/view/mathfun/mathfun-svg.html
