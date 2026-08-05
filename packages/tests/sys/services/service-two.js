
import { Log, toStr } from '../lib/core.js';

const log = Log(0); // Log({ name: 'services', level: 3 });

const serviceTwo = (params) => {
  const result = `<br/><pre>serviceTwo</pre><br/><pre>${toStr(params)}</pre>`;
  return result;
};

export default serviceTwo;
