const { VideoUtil } = require('../lib/index.js');

const videoUtilIns = new VideoUtil();

(async function tt() {
  // const ret = await videoUtilIns.getVideoInfo(
  //   '/Users/apple/Desktop/48c0345c87d6149127dabb7c9b5c3de0-1661482184103.mp4',
  // );
  const t1 = Date.now();
  console.log('t1', t1);
  const ret = await videoUtilIns.getVideoFrame({
    // retType: 'path',
    videoUrl: '/Users/apple/Desktop/48c0345c87d6149127dabb7c9b5c3de0-1661482184103.mp4',
    // time: '1',
  });
  console.log(ret, ', 耗时:', Date.now() - t1);
})();
