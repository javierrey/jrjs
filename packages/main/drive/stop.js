// main/drive/stop.js
/* Runtime stop script. */
// @ts-check

import { environ, stopSavedPrimaryProcess } from './hub.js';

environ.hub.savePid && stopSavedPrimaryProcess();
