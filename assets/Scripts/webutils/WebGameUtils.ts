import { sys } from "cc";
import { Utils } from "../../Piter.Framework/BaseKit/Util/Utils";
import Global from "../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../Piter.Framework/UIKit/Example/DefaultToast";
import { Base64Utils } from "../../Piter.Framework/UIKit/Util/Base64Utils";
import { config_slo_subgame } from "../config/config_slo_subgame";
import { ServerConfig } from "../game/constant/ServerConst";

export class WebGameUtils {

  static HOME_PAGE_URL: string;

  static OP_RETURN_TYPE: string;

  static SECERT_TOKEN: string;

  static TRUE_URL: string;

  static TRUE_SEARCH: string

  static GID: string;

  static TOKEN: string;

  static NOTICE_PMD: string;

  static GCID: string;

  public static initParam() {
    WebGameUtils.HOME_PAGE_URL = decodeURIComponent(Utils.getURLQueryString("op_home_url")) || "";
    WebGameUtils.OP_RETURN_TYPE = decodeURIComponent(Utils.getURLQueryString("op_return_type")) || "";
    WebGameUtils.GID = Utils.getURLQueryString("gid") || "";
    WebGameUtils.GCID = Utils.getURLQueryString("gcid") || "";
    WebGameUtils.NOTICE_PMD = Utils.getURLQueryString("UI_A") || "";
    if (!WebGameUtils.GID) {
      WebGameUtils.GID = Utils.getURLQueryString("gid", false) || "";
    }
  }

  /**
   * 只用一次
   * @returns 
   */
  public static getGCID() {
    if (this.GCID) {
      let sceneId = Number(this.GCID);
      this.GCID = null;
      return sceneId
    }
    return null
  }

  /**
   * 
   * @returns 返回平台首页
   */
  public static goHome() {
    if (sys.isNative) {
      return;
    }
    if (WebGameUtils.HOME_PAGE_URL && WebGameUtils.HOME_PAGE_URL != "null") {
      DefaultAlertView.addAlert("是否返回平台首页?", () => {
        window.location.href = WebGameUtils.HOME_PAGE_URL;
      }, null, false);
    }
  }


  public static goHomeNoAlert() {
    if (sys.isNative) {
      return;
    }
    if (WebGameUtils.HOME_PAGE_URL && WebGameUtils.HOME_PAGE_URL != "null") {
      window.location.href = WebGameUtils.HOME_PAGE_URL;
    }
  }


  public static addOrgToUrl(url, paramName, replaceWith) {
    //url字符串添加参数
    //url:路径地址 paramName：参数名 replaceWith：参数值
    if (url.indexOf(paramName) > -1) {
      let re = eval('/(' + paramName + '=)([^&]*)/gi');
      url = url.replace(re, paramName + '=' + replaceWith);
    } else {
      let paraStr = paramName + '=' + replaceWith;

      let idx = url.indexOf('?');
      if (idx < 0)
        url += '?';
      else if (idx >= 0 && idx != url.length - 1)
        url += '&';
      url = url + paraStr;
    }
    return url;
  }


  static removeStr(source, index) {
    return source.substring(0, index) + source.substring(index + 1);
  }


  /**
   * 对gameToken进行解码
   * @param token gameToken
   */
  static decodeGameToken(token) {
    if (token.length < 96) {
      throw 'Game Token Error'
    }
    for (let i = 0; i < 4; i++) {
      token = this.removeStr(token, 23 * (i + 1) + 3 - i);
    }
    return token
  }


  public static flushWindow() {
    if (sys.isNative) {
      return;
    }
    // if (FrameUtils.isError) {
    // 	return;
    // }
    if (window.parent) {
      window.location.reload();
      // window.parent.location.href = window.parent.location.href;
    } else {
      window.location.reload();
    }

  }

  public static setTrueSeach(tokenUrl) {
    let trueSeach = "?" + tokenUrl;
    this.TRUE_URL = window.location.origin + window.location.pathname + trueSeach;
    this.TRUE_SEARCH = trueSeach
  }


  /**
   * 在指定位置插入字符串
   * @param source 原始字符串
   * @param start 要插入的位置
   * @param newStr 要插入的字符串
   */
  public static insertStr(source: string, start: number, newStr: string) {
    return source.slice(0, start) + newStr + source.slice(start);
  }


  private static StringNumber = '123456789';
  private static StringNumber0 = '0123456789';
  private static StringABC = 'abcdefghijklmnpqrstuvwxyz';
  private static StringNumberABC = '0123456789abcdefghijklmnpqrstuvwxyz';
  /**
     * 生成随机字符串
     * @param length
     * @param randType
     * @returns {string}
     */
  public static randomString(length: number, randType: RandomStrType) {
    let str = 'abcdefghijklmnpqrstuvwxyz123456789';
    if (typeof randType === 'number') {
      switch (randType) {
        case RandomStrType.number:
          str = this.StringNumber;
          break;
        case RandomStrType.number0:
          str = this.StringNumber0;
          break;
        case RandomStrType.string:
          str = this.StringABC;
          break;
        default:
          str = this.StringNumberABC;
          break;
      }
    }
    const maxPos = str.length;
    let code = '';
    for (let i = 0; i < length; i++) {
      const txt = str.charAt(Math.floor(Math.random() * maxPos));
      code += txt;
    }
    return code;
  }

  static async openSubgame(gameConfig: config_slo_subgame, callback: Function) {
  }

  /**
   * 窗口全屏
   */
  public static windowFullscreen() {
    if (sys.os == sys.OS.IOS) {
      DefaultToast.instance.showText("苹果系统无法全屏，推荐chrome浏览器");
      return;
    }
    // DefaultToast.instance.showText("若游戏无法全屏请使用浏览器自带全屏功能");
    if (window.parent && window.parent['screenfull']) {
      window.parent['screenfull'].enabled && window.parent['screenfull'].toggle();
      return;
    }
    window['screenfull'].enabled && window['screenfull'].toggle();
  }


  public static getOuterWebGame(gid: string) {
    let gameData: MSG_OuterWebGame = {
      token: Global.HTTP.token,
      http: ServerConfig.PATH_CONFIG.http_server,
      ws: ServerConfig.PATH_CONFIG.socket_server,
      op_return_type: "3",
    }
    if (gid) {
      gameData.gid = gid;
    }
    let url = "";
    for (let key in gameData) {
      url += `${key}=${gameData[key]}&`;
    }
    url = url.slice(0, url.length - 1);
    let trueUrl = Base64Utils.encode(url);
    return trueUrl;
  }
}

export interface MSG_OuterWebGame {
  token: string;
  http: string;
  ws: string;
  op_home_url?: string;
  op_return_type?: string;
  gid?: string;
  gcid?: string;
  UI_A?: string;
}

export enum RandomStrType {
  number = 1,
  number0,
  string,
  mix,
}