import { sys } from "cc";
import { DEBUG } from "cc/env";

/*
 * @Author: li mengchan
 * @Date: 2018-09-10 10:30:35
 * @Last Modified by: lixiaodi
 * @Last Modified time: 2021-02-02 16:03:00
 * @Description: 日志输出等级  1 debug 2 info 3 error
 */
export class LogUtils {
    public static DEBUG: number = 1;
    public static INFO: number = 2;
    public static ERROR: number = 4;
    public static WAING: number = 3;
    public static loglevel = 1;
    /**
     * 输出DEBUG JSON格式日志
     */
    public static logDJ(data) {
        if (DEBUG) {
            if (LogUtils.loglevel <= LogUtils.DEBUG) {
                if (sys.isBrowser) {
                    console.log("json param=%j", data);
                } else {
                    console.log(JSON.stringify(data));
                }
            }
        }
    }
    /**
     * 输出DEBUG日志
     */
    public static logD(message?: any, ...optionalParams: any[]) {
        if (DEBUG) {
            if (LogUtils.loglevel <= LogUtils.DEBUG) {
                if (sys.isBrowser) {
                    console.log("debug:" + message, optionalParams);
                } else {
                    console.log("debug:" + message, JSON.stringify(optionalParams));
                }
            }
        }
    }
    /**
     * 输出错误日志
     * @param  {} data
     */
    public static logE(data) {
        if (LogUtils.loglevel <= LogUtils.ERROR) {
            console.log("error:", data);
        }
    }
    /**
     * 输出info等级日志
     * @param  {} data
     */
    public static logI(message?: any, ...optionalParams: any[]) {
        if (LogUtils.loglevel <= LogUtils.INFO) {
            console.log("info:" + message, optionalParams);
        }
    }
    public static logW(message?: any, ...optionalParams: any[]) {
        if (LogUtils.loglevel <= LogUtils.WAING) {
            console.warn("warn:" + message, optionalParams);
        }
    }
}
