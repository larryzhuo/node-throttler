import crypto from 'crypto';

class Util {
  md5(param: any) {
    const m = crypto.createHash('md5');
    m.update(param);
    const str = m.digest('hex');
    return str.toUpperCase();
  }
}

const util = new Util();
export default util;
