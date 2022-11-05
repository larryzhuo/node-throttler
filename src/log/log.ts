import * as os from 'os';
const log4js = require('log4js');

log4js.configure({
  appenders: { video: { type: 'file', filename: `${os.homedir()}/video.log` } },
  categories: { default: { appenders: ['video'], level: 'info' } },
});

const logger = log4js.getLogger('video');
export default logger;
