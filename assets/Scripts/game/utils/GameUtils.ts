import { game, native, sys } from "cc";
import { LocalStorageData } from "../../../Piter.Framework/BaseKit/Data/LocalStorageData";
import Global, { PiterGloal } from "../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../constant/ServerConst";
import { GamePlayerManager } from "../manager/GamePlayerManager";

export class GameUtils {

  static isInit: boolean = false;

  static locationInfo: any;
  static init() {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    native.bridge.onNative = (event: string, values: string): void => {
      try {
        // log("navite event111 " + event + "data:" + values)
        if (values) {
          let jsonData = JSON.parse(values)
          if (jsonData && jsonData.sequence) {
            let callback1 = this.m_callbackList.get(jsonData.sequence);
            if (callback1) {
              // log("navite event222 调用callback")
              callback1(jsonData);
              this.m_callbackList.delete(jsonData.sequence);
              return;
            }
          }
        }
      } catch (error) {
      }
      Global.EVENT.dispatchEvent(event, values);
    }
  }


  public static async saveImage(base64Str, imageName) {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("saveImage", {
        imageStr: base64Str,
        imageName: imageName
      });
    }
  }


  public static async SDKInit() {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("SDKInit", {}) as any;
      return data;
    }
  }

  public static async getDosServerInfo(name: string) {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("getDosServerInfo", {
        serverName: name
      }) as any;
      return data;
    }
    return { code: -1 };
  }


  public static async getDosInfo(name: string) {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("getDosServer", {
        httpName: name,
        socketName: name
      }) as any;
      return data;
    }
    return { code: -1 };
  }
  /**
   * 跳转url
   * @param url 
   */
  static goUrl(url: string) {
    if (sys.isBrowser) {

      window.open(url);
    } else {
      this.notifyMessage("goUrl", { url: url })
    }
  }


  static async setClipBordStr(str: string, text = "已复制到剪贴板") {
    if (sys.isBrowser) {
      try {
        await navigator.clipboard.writeText(text);
        DefaultToast.instance.showText(text)
      } catch (err) {
        DefaultToast.instance.showText(`获取剪切板数据失败,请检查浏览器权限或更换浏览器`)
      }
    } else {
      DefaultToast.instance.showText(text)
      this.notifyMessage("setClipboardData", { str: str })
    }
    return "";
  }

  static async getClipBoardStr() {
    if (sys.isBrowser) {
      try {
        const text = await navigator.clipboard.readText();
        return text;
      } catch (err) {
        DefaultToast.instance.showText(`获取剪切板数据失败,请检查浏览器权限或更换浏览器`)
      }
    } else {
      let data = await this.sendNativeMessage("getClipBoardStr", {}) as any
      return data.str;
    }
  }

  static async getDeviceInfo() {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("getDeviceInfo", {}) as any
      return data.info;
    } else {
      return {};
    }
  }

  /**
   * 打开qq android todo
   */
  static async goQQ(qq: string) {
    if (!qq.trim()) {
      return false;
    }
    if (sys.isNative) {
      this.notifyMessage("open_qq", { "value": qq });
    } else {
      window.open(`http://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`)
    }
  }


  static async getPlayerLocation() {
    if (this.locationInfo) {
      return this.locationInfo;
    }
    if (sys.isBrowser) {
      return new Promise((res, rej) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            let latitude = position.coords.latitude; // 获取纬度
            let longitude = position.coords.longitude; // 获取经度
            this.locationInfo = { j: longitude, w: latitude };
            res(this.locationInfo)
          }, (error) => {
            this.locationInfo = { j: 0, w: 0 };
            res(this.locationInfo)
          });
        } else {
          this.locationInfo = { j: 0, w: 0 };
          res(this.locationInfo)
        }
      })
    } else {
      let data = await this.sendNativeMessage("getLocationInfo", {}) as any
      this.locationInfo = { j: data.j, w: data.w };
      return { j: data.j, w: data.w };
    }
  }

  /**
   * 打开微信 android todo
   */
  static async goWechat(wechat: string) {
    if (!wechat.trim()) {
      return false;
    }
    if (sys.isNative) {
      this.notifyMessage("open_wechat", { "value": wechat });
    }
  }

  /**
   * 获取设备唯一编号
   * @static
   * @return {*} 
   */
  static async getUniId() {
    if (sys.isBrowser) {
      let uiid = LocalStorageData.getItem("uniId");
      if (uiid) {
        return uiid;
      } else {
        uiid = await this.getWebUniId();
        LocalStorageData.setItem("uniId", uiid);
        return uiid;
      }
    } else if (sys.isNative) {
      let data = await this.sendNativeMessage("getMacAddress", {}) as any;
      return data.uniId;
    }
  }

  static async getWebUniId(): Promise<string> {
    return new Promise((resolve, reject) => {
      let uuid = this.generateUUID();
      resolve(uuid);
      // window['Fingerprint2'].get((components) => {
      //   const values = components.map(component => component.value);
      //   const uiid = window['Fingerprint2'].x64hash128(values.join(''), 31);
      //   resolve(uiid);
      // });
    });
  }

  /**
 * generateUUID 生成UUID
 * @returns {string} 返回字符串
 */
  static generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
  }

  //ios todo
  static openSubGame(data: SubGameWebViewInfo) {
    if (sys.isNative) {
      let player = GamePlayerManager.instance.player
      data.uid = player.simpleUser.uid;
      data.token = Global.HTTP.token;
      if (data.direction == undefined || data.direction == null) {
        data.direction = 0;
      }
      data.gameUrl = decodeURIComponent(data.gameUrl);
      // data.direction = this.getGameDirection(data.gameId, data.direction);
      if (!data.exitRequestUrl) {
        data.exitRequestUrl = ServerConfig.PATH_CONFIG.http_server + "/api/connect/close-outer-url"
      }
      Global.IN_OUTER = true;
      native.bridge.sendToNative("open_subgame_url", JSON.stringify(data));
    }
  }

  static async getAPPVersion() {
    if (sys.isNative) {
      // let data = await this.sendNativeMessage("get_app_version", {}) as any;
      // Global.VERSION.APP = data.versionName + "." + data.versionCode;
      if (sys.os == sys.OS.ANDROID) {
        let data = await this.sendNativeMessage("get_app_version", {}) as any;
        if (data.versionCode) {
          Global.VERSION.APP = data.versionName + "." + data.versionCode;
        } else {
          Global.VERSION.APP = data.versionName
        }
      } else {
        let data = await this.sendNativeMessage("get_app_version", {}) as any;
        Global.VERSION.APP = data.versionName;
      }
    }
    return Global.VERSION.APP;
  }

  static async fixOrientation() {
    if (sys.isNative) {
      if (sys.os == sys.OS.IOS && Global.UI.currentModel == 1) {
        this.sendNativeMessage("fix_orientation", {});
      }
    }

  }

  //ios todo
  static async getNativeOrientation() {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("get_native_orientation", {}) as any;
      PiterGloal.UI_DIRECTION = data.type;
      if (Global.UI && Global.UI.uIRoot) {
        Global.UI.uIRoot.updateSafeArea(PiterGloal.UI_DIRECTION);
      }
      return PiterGloal.UI_DIRECTION;
      //  native.bridge.sendToNative("get_native_orientation");
    }
    return "1";
  }

  static uploadHeader(url) {
    if (sys.isNative) {
      GameUtils.notifyMessage("upload_header_start", {
        url: url
      })
    }
  }

  /**
   * 通知natvei
   * @param key 
   * @param data 
   */
  static notifyMessage(key, data) {
    native.bridge.sendToNative(key, JSON.stringify(data));
  }


  static async getPackageName() {
    let data = await GameUtils.sendNativeMessage("getPackageName") as any;
    return data.packageName;
  }


  /**
   * 通知带回调
   * @param key 
   * @param data 
   */
  static sequence: number = 1;
  private static m_callbackList: Map<number, Function> = new Map<number, Function>();
  static sendNativeMessage(key, data?) {
    return new Promise((rs, rj) => {
      if (!data) {
        data = {};
      }
      data.sequence = this.sequence;
      this.m_callbackList.set(data.sequence, (resp: any) => {
        rs(resp);
      });
      native.bridge.sendToNative(key, JSON.stringify(data));
      this.sequence++;
      if (this.sequence > 9999) {
        this.sequence = 1;
      }
    });
  }


  static gameDirections: any = null;
  static saveLastGameDirection(data) {
    if (!this.gameDirections) {
      this.gameDirections = LocalStorageData.getItem("game_directions");
      if (!this.gameDirections) {
        this.gameDirections = {};
      } else {
        this.gameDirections = JSON.parse(this.gameDirections)
      }
    }
    this.gameDirections[data.gameId] = this.gameDirections[data.direction];
    LocalStorageData.setItem("game_directions", JSON.stringify(this.gameDirections));
  }


  static getGameDirection(gameId, defaultValue: number) {
    if (!this.gameDirections) {
      this.gameDirections = LocalStorageData.getItem("game_directions");
      if (!this.gameDirections) {
        this.gameDirections = {};
      } else {
        this.gameDirections = JSON.parse(this.gameDirections)
      }
    }
    let back = Number(this.gameDirections[gameId]);
    if (isNaN(back)) {
      return defaultValue;
    }
    return back;
  }


  /**
   * 版本号对比
   * @param oldVersion 
   * @param newVersion 
   */
  static compareVersions(oldVersion, newVersion) {
    const v1 = oldVersion.split('.').map(Number);
    const v2 = newVersion.split('.').map(Number);
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = i < v1.length ? v1[i] : 0;
      const num2 = i < v2.length ? v2[i] : 0;
      if (num1 > num2) {
        return 1; // version1 大于 version2
      } else if (num1 < num2) {
        return -1; // version1 小于 version2
      }
    }
    return 0; // version1 等于 version2
  }


  static h5GoSubGame1(data) {
    this.outerGameInfo = data;
    let iframe = document.createElement("iframe");
    iframe.id = "gameIframe",
      iframe.name = "gameIframe",
      iframe.style.height = "100%",
      iframe.style.width = "100%",
      iframe.style.border = "none",
      iframe.src = this.outerGameInfo.gameUrl,
      document.getElementById("MyDiv").style.width = "100%",
      document.getElementById("MyDiv").style.height = "100%",
      document.getElementById("MyDiv").appendChild(iframe);
    var n, o, s, r, u = !1, h = 0, l = 0, _ = !1, d = !0, f = document.getElementById("btnBackLobby");
    // f.addEventListener("touchstart", m),
    //   f.addEventListener("touchend", y),
    //   f.addEventListener("touchmove", g),
    f.style.width = 90 == Number(window.orientation) ? "10%" : "18%",
      window.addEventListener("orientationchange", (function () {
        90 == window.orientation || -90 == window.orientation ? f.style.width = "10%" : f.style.width = "18%"
      }
      ), !1),
      f.style.height = "auto"
    const homeBtn = document.getElementById('homeBtn');
    let touchEnd = () => {
      window['isDragging'] = false;
      if (window['isClickPending']) {
        this.closeH5OuterGame(data, f);
        f.removeEventListener('touchend', touchEnd);
        window['isClickPending'] = false;
      }
    }
    f.addEventListener('touchend', touchEnd.bind(this), { passive: false });
  }

  static outerGameInfo: any;

  static lockBack: boolean = false;
  public static async closeH5OuterGame(data, callback: any) {
    if (GameUtils.lockBack) {
      return;
    }
    GameUtils.lockBack = true
    let result = window.confirm("是否退出当前游戏?");
    if (result) {
      if (sys.isBrowser && sys.isMobile) {
        game.resume();
      }
      let path = ServerConfig.PATH_CONFIG.http_server + "/api/connect/close-outer-url"
      let resp = await Global.HTTP.sendRequestAsync(path, {
        uid: data.uid,
        gameId: data.gameId
        // gameId: 1
      });
      GameUtils.lockBack = false;
      callback && callback();
      Global.UI.showOuterLayer();
      Global.EVENT.dispatchEvent(`exit_subgame`)
    } else {
      GameUtils.lockBack = false;
    }
  }


  static h5GoSubGame(data) {
    if (sys.isNative) {
      return;
    }
    if (!sys.isMobile) {
      window.open(data.gameUrl);
      return;
    }
    // } else {
    let self = this;
    var i = document.createElement("iframe");
    var clickon = false;
    var isDragging = false;
    i.id = "gameIframe",
      i.name = "gameIframe",
      i.style.height = "100%",
      i.style.width = "100%",
      i.style.border = "none",
      i.src = data.gameUrl,
      document.getElementById("MyDiv").style.width = "100%",
      document.getElementById("MyDiv").style.height = "100%",
      document.getElementById("MyDiv").appendChild(i);
    var n, o, s, r, u = !1, h = 0, l = 0, _ = !1, d = !0, f = document.getElementById("btnBackLobby");
    var dragOffsetX = 0;
    var dragOffsetY = 0;
    function m(t) { //start
      t.preventDefault(),
        // s = Number(t.touches[0].pageX) - h,
        // r = Number(t.touches[0].pageY) - l,
        // 0 != h || 0 != l ? (s = Number(t.touches[0].pageX),
        //   r = Number(t.touches[0].pageY),
        //   d = !1) : (s = Number(t.touches[0].pageX) - h,
        //     r = Number(t.touches[0].pageY) - l,
        //     d = !0),
        u = !0;
      isDragging = true;
      dragOffsetX = t.touches[0].clientX - f.getBoundingClientRect().left;
      dragOffsetY = t.touches[0].clientY - f.getBoundingClientRect().top;
      f.style.cursor = 'grabbing';
      clickon = true
    }
    function g(t) { //move
      if (!isDragging) return;

      const newX = t.touches[0].clientX - dragOffsetX;
      const newY = t.touches[0].clientY - dragOffsetY;

      const maxX = window.innerWidth - f.offsetWidth;
      const maxY = window.innerHeight - f.offsetHeight;
      const clampedX = Math.min(Math.max(0, newX), maxX);
      const clampedY = Math.min(Math.max(0, newY), maxY);
      v(clampedX, clampedY, f)
      clickon = false
    }
    function y(t) { //end
      if (!clickon) {
        return;
      }
      self.closeH5OuterGame(data, () => {
        u && (s = n,
          h = 0,
          (r = o) < 0 || r > screen.height ? (v(0, 0, f),
            o = 0) : v(0, o, f),
          l = o,
          _ || function () {
            _ || (document.getElementById("MyDiv").style.height = "0%",
              document.getElementById("MyDiv").style.width = "0%",
              document.getElementById("MyDiv").removeChild(document.getElementById("MyDiv").firstChild),
              f.style.width = "0px",
              f.style.height = "0px",
              f.removeEventListener("touchstart", m),
              f.removeEventListener("touchend", y),
              f.removeEventListener("touchmoe", g),
              v(0, 0, f));
            _ = !1
          }(),
          _ = !1,
          u = !1)
      })
    }
    function v(t, e, i) {
      i.style.transform = "translate3d(" + t + "px, " + e + "px, 0)"
    }
    f.addEventListener("touchstart", m),
      f.addEventListener("touchend", y),
      f.addEventListener("touchmove", g),
      f.style.width = 90 == Number(window.orientation) ? "10%" : "18%",
      window.addEventListener("orientationchange", (function () {
        90 == window.orientation || -90 == window.orientation ? f.style.width = "10%" : f.style.width = "18%"
      }
      ), !1),
      f.style.height = "auto"
  }
  // }

  public static checkIOSLock() {
    if (sys.isNative) {
      return;
    }
    // if(Global.UI.currentModel == 1){
    //   if (window.innerHeight > window.innerWidth) {
    //     // 当前是竖屏
    //     alert("请打开手机横竖屏方向锁，并且横向手持设备！");
    //   }
    // }
  }

  //------------电池信息----------
  public static checkBatteryInit() {
    if (sys.isNative) {
      return true;
    }
    if ('battery' in navigator) {
      let battery = navigator['battery'] || navigator['webkitBattery'] || navigator['mozBattery'];

      if (battery) {
        return true;
      }
    }
    return false;
  }


  public static async getBatteryValue() {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("get_battery_value", {}) as any;
      return data.value;
    }
    if ('battery' in navigator) {
      let battery = navigator['battery'] || navigator['webkitBattery'] || navigator['mozBattery'] as any;
      return battery.level * 100;
    }
    return 0;
  }

  public static async getNetWorkState() {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("getNetWorkState", {}) as any;
      return data.state;
    }
    return 1;
  }


  public static async sendNativeGetRequest(url) {
    if (sys.isNative) {
      let data = await this.sendNativeMessage("sendNativeGetRequest", { url: url }) as any;
      return data;
    }
  }

  public static async checkWebMobileNotFullScreen() {

  }
}


export interface SubGameWebViewInfo {

  token?: string;

  gameUrl: string;

  gameId: number;

  exitRequestUrl?: string;

  uid?: string;

  direction: number;

  reconnect: boolean;
}
