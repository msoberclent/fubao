
import { Label, Node, ScrollView, _decorator, instantiate, v3 } from 'cc';
import { PromotionBaseNode } from "./PromotionBaseNode";
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
const { ccclass, property } = _decorator;
/**
 * 整盘分红推广说明
 */
@ccclass('PromotionZPFHRuleNode')
export class PromotionZPFHRuleNode extends PromotionBaseNode {

  @PiterDirector.AUTO_BIND(Node)
  AT_TshuomingItem: Node;
  @PiterDirector.AUTO_BIND(Node)
  AT_TshuomingSc: Node;

  public async init() {
    this.requestTuiguangShuoming();
  }

  public showConfigs() {
    let list = this.responseData.data.configList;
    this.AT_TshuomingSc.getComponent(ScrollView).content.destroyAllChildren();
    list.sort((a, b) => {
      return a.lv - b.lv;
    })
    for (let i = 0; i < list.length; i++) {
      let v = instantiate(this.AT_TshuomingItem);
      v.setPosition(v3(0, 0));
      v.active = true;
      v.getChildByName("lvl").getComponent(Label).string = list[i].name;
      v.getChildByName("yeji").getComponent(Label).string = list[i].flow;
      v.getChildByName("ticheng").getComponent(Label).string = list[i].bonus;
      this.AT_TshuomingSc.getComponent(ScrollView).content.addChild(v);
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