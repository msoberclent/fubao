import { Button, Label, Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import { RechargeMethodItem } from "../../../../message/GameMessage";
import { GameUtils } from "../../../../utils/GameUtils";
import { BaseRechargeContent } from "./BaseRechargeContent";

const { ccclass, property } = _decorator;
@ccclass('RechargeRGContent')
export class RechargeRGContent extends BaseRechargeContent {

  @PiterDirector.AUTO_BIND(Node)
  AT_QQGroup: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_WXGroup: Node;

  async onShowUI(method: RechargeMethodItem) {
    await super.onShowUI(method);
    this.showContent();
    this.lockReq = false;
  }

  QQItemTouch(e, qq) {
    if (qq) {
      GameUtils.goQQ(qq);
    }
  }

  WXItemTouch(e, wx) {
    if (wx) {
      GameUtils.goWechat(wx);
    }
  }

  showContent() {
    let qqDatas = [];
    let wxDatas = [];
    for (let i = 0; i < this.channelList.length; i++) {
      let channel = this.channelList[i];
      if (channel.active) {
        if (channel.channelKey == "qq") {
          qqDatas.push(channel)
        } else if (channel.channelKey == "wx") {
          wxDatas.push(channel)
        }
      }
    }

    for (let i = 1; i <= 6; i++) {
      let item = this.AT_QQGroup.getChildByName("item" + i);
      let data = qqDatas[i - 1];
      item.active = data != null
      if (data) {
        item.getChildByName("openidLabel").getComponent(Label).string = data.channelLine;
        item.getComponent(Button).clickEvents[0].customEventData = data.channelLine
      }
    }

    if (this.AT_WXGroup) {
      for (let i = 1; i <= 6; i++) {
        let item = this.AT_WXGroup.getChildByName("item" + i);
        let data = wxDatas[i - 1];
        item.active = data != null
        if (data) {
          item.getChildByName("openidLabel").getComponent(Label).string = data.channelLine;
          item.getComponent(Button).clickEvents[0].customEventData = data.channelLine
        }
      }
    }
  }

}
