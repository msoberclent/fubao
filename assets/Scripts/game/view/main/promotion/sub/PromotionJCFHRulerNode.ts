
import { ScrollView, instantiate, v3, Label, Node } from 'cc';
import { _decorator } from 'cc';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
import { PromotionBaseNode } from "./PromotionBaseNode";
const { ccclass, property } = _decorator;
/**
 * 亏损分红推广说明
 */
@ccclass('PromotionJCFHRulerNode')
export class PromotionJCFHRulerNode extends PromotionBaseNode {

  @PiterDirector.AUTO_BIND(Node)
  AT_TshuomingItem: Node;
  @PiterDirector.AUTO_BIND(Node)
  AT_TshuomingSc: Node;
  @PiterDirector.AUTO_BIND(Node)
  AT_TshuomingLayout: Node;

  public async init() {
    this.requestTuiguangShuoming();
  }

  public showConfigs() {
    let list = this.responseData.data.configList;
    list.sort((a, b) => {
      return a.lv - b.lv;
    })
    for (let i = 0; i < list.length; i++) {
      let index = (i + 1);
      let v = this.AT_TshuomingLayout.getChildByName(`item${index}`);
      v.active = true;
      v.getChildByName("lvl").getComponent(Label).string = list[i].name;
      v.getChildByName("yeji").getComponent(Label).string = list[i].flow;
      v.getChildByName("ticheng").getComponent(Label).string = list[i].bonus;
    }
  }

  /**
       * 推广说明 
       */
  async requestTuiguangShuoming() {
    if (this.isInited) {
      this.showConfigs();
      return;
    }
    let data = await Global.HTTP.sendGetRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/query-fanyong-config", {});
    if (data.code == 200) {
      this.isInited = true;
      this.responseData = data;
      this.showConfigs();
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }


}