import cmdIns, { ICmdRun } from './cmd';
import logger from './log/log';
import util from './util';
import fs from 'fs';
import * as os from 'os';

export interface IGetFrameOption {
  retType?: 'path' | 'buffer'; // 返回类型
  videoUrl: string; // 文件路径
  time?: string; // 截帧时间点  00:00:01
  outdir?: string; // 保存路径
}

export interface IFormatRet {
  format: {
    filename: string;
    nb_streams: number;
    nb_programs: number;
    format_name: string;
    format_long_name: string;
    start_time: string;
    duration: string;
    size: string;
    bit_rate: string;
    probe_score: number;
    tags: any;
  };
}

export interface IFrameRet {
  fileName: string;
  path?: string;
  buf?: Buffer;
}

/**
 * 依赖于 ffmpeg，ffprobe 处理视频
 */
export class VideoUtil {
  /**
   * 通过 ffprobe 获得视频信息
   * @param videoUrl
   */
  async getVideoInfo(videoUrl: string): Promise<IFormatRet> {
    if (!videoUrl) {
      throw new Error(`videoUrl 空`);
    }
    try {
      const ret: ICmdRun = await cmdIns.run('ffprobe', [
        '-show_format',
        '-print_format',
        'json',
        '-i',
        videoUrl,
      ]);
      logger.info(`output:`, ret.out);
      // 解析 ret output，读取信息
      const retJson: IFormatRet = JSON.parse(ret.out);
      return retJson;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  /**
   * 通过 ffmpeg 获得视频截帧
   * 返回值： 文件路径 或者 Buffer
   */
  async getVideoFrame(opts: IGetFrameOption): Promise<IFrameRet> {
    const { videoUrl } = opts;
    let { time, retType, outdir } = opts;
    if (!videoUrl) {
      throw new Error(`videoUrl 空`);
    }
    time = time || '00:00:01';
    retType = retType || 'buffer';
    outdir = outdir || os.homedir();

    const fileName = `${util.md5(videoUrl)}.png`;
    const outFile = `${outdir}/${fileName}`;
    const frameRet: IFrameRet = {
      fileName,
    };
    try {
      const ret: ICmdRun = await cmdIns.run('ffmpeg', [
        '-ss',
        time,
        '-i',
        videoUrl,
        '-frames:v',
        '1',
        outFile,
      ]);
      logger.info(`output:`, ret.out);
      if (retType == 'path') {
        frameRet.path = outFile;
        return frameRet;
      }

      if (retType == 'buffer') {
        frameRet.buf = await fs.promises.readFile(outFile);
        // fs.promises.rm(outFile);
        return frameRet;
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
    throw new Error('retType not match');
  }
}
