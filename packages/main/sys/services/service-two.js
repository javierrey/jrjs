
import { log, toStr } from './shared.js';

const serviceTwo = (params) => {
  const result = `<br/><pre>serviceTwo</pre><br/><pre>${toStr(params)}</pre>`;
  return result;
};

export default serviceTwo;
