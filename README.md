Node.js wrap ffmpeg and ffprobe to process video.

### Install

> npm install video-util

### Example

```typescript
import { VideoUtil, IGetFrameOption } from 'video-util';

let videoUtilIns = new VideoUtil();

(async function test() {
  //get video info
  let ret = await videoUtilIns.getVideoInfo('xx.mp4');

  //get video one frame by time
  let params:IGetFrameOption = {
    retType: 'path';   //返回类型
    videoUrl: 'xx.mp4';   //文件路径
    time?: '00:00:01';   //截帧时间点  00:00:01
    outdir: '/';   //保存路径
  }
  let ret1 = await videoUtilIns.getVideoFrame(params);
})();

```
