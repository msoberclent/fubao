import { sys } from "cc";
import { GameUtils } from "../game/utils/GameUtils";

export class OpeninstallAPI {

  static openInstallData;

  /**
   * 获取邀请数据
   */
  static async getOpenInstallData() {
    if (sys.isNative) {
      let respData = await GameUtils.sendNativeMessage("getOpenInstallData") as any;
      this.openInstallData = respData.data;
      return respData.data;
    }
  }
}