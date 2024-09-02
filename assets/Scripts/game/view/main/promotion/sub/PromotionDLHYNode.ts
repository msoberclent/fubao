import { Label, _decorator } from "cc";
import { GoldUtils } from "../../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../../constant/ServerConst";

const { ccclass, property } = _decorator;
@ccclass('PromotionDLHYNode')
export class PromotionDLHYNode extends PiterUI {

  createChildren() {
    super.createChildren();
    this.getData();
  }

  public async getData() {
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-reward-data", {}, true);
    if (resp.code == 200) {
      this.respData = resp.data;
      this.showUI();
    } else {
      DefaultToast.instance.showText(resp.msg)
    }
  }

  respData: any;

  showUI() {
    this.showLabels();
  }

  showLabels() {
    let labels = [
      { name: "rechargeTeam", label: "top/tdcz", desc: "团队存款", divGold: true },
      { name: "withdrawTeam", label: "top/tdtx", desc: "团队提款", divGold: true },
      { name: "diffTeam", label: "top/tdctc", desc: "团队提-存", divGold: true },

      { name: "rechargeOne", label: "top/zscz", desc: "直属存款", divGold: true },
      { name: "withdrawOne", label: "top/zstx", desc: "直属提款", divGold: true },
      { name: "diffOne", label: "top/zsctc", desc: "直属提-存", divGold: true },

      { name: "jiChaReward", label: "left/bqyg", desc: "本期领取流水佣金", divGold: true },
      { name: "currReward", label: "right/bqls", desc: "本期预估佣金", divGold: true },
    ];
    for (let i = 0; i < labels.length; i++) {
      let item = labels[i];
      let node = this.node.getChildByPath(item.label);
      if (item.name) {
        if (item.divGold) {
          node.getComponent(Label).string = GoldUtils.formatGold(this.respData[item.name]);
        } else {
          node.getComponent(Label).string = this.respData[item.name]
        }
      }
    }
    this.node.getChildByPath("top/id").getComponent(Label).string = Global.PLAYER.player.simpleUser.uid + "";
    this.node.getChildByPath("top/fhdw").getComponent(Label).string = new Big(this.respData['rate']).mul(100).round(2, 0) + "%";
  }
}
