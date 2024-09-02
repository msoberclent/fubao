import { Button, Component, Label, Node, Sprite, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ServerConfig } from "../../../constant/ServerConst";

/**
 * 财神到
 */
const { ccclass, property } = _decorator;
@ccclass('ActivityCSDItem')
export class ActivityCSDItem extends Component {

  @property(Label)
  titleLabel: Label = null

  @property(Label)
  contentLabel: Label = null

  @property(Label)
  rewardLabel: Label = null

  @property(Label)
  progressLabel: Label = null

  @property(Sprite)
  progressSprite: Sprite = null

  @property(Node)
  ylqNode: Node = null;

  @property(Node)
  rewardBtn: Node = null;

  itemData;

  lockReq: boolean = false;
  public async onRewardBtnTouch() {
    if (this.lockReq) {
      return;
    }
    this.lockReq = true;
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + '/api/gate/mission-get-reward', {
      missionId: this.itemData.missionId
    });
    this.lockReq = false;
    if (resp.code == 200) {
      this.itemData.rewarded = true;
      this.rewardBtn.active = false;
      this.ylqNode.active = true;
      DefaultToast.instance.showText("领取成功,获得 " + GoldUtils.muiltRate(this.itemData.rewardGold) + " 金币奖励");
    } else {
      DefaultAlertView.addOnlyAlert(resp.msg)
    }
  }

  public updateItem(itemData) {
    this.itemData = itemData;
    this.titleLabel.string = itemData.missionContent;
    this.contentLabel.string = itemData.missionDesc;
    let progress = itemData.progressCurrent / itemData.progressTotal;
    let lockReward = true;
    if (progress >= 1) {
      progress = 1;
      lockReward = false;
    }
    if (itemData.rewarded) {
      this.rewardBtn.active = false;
      this.ylqNode.active = true;
      ButtonUtils.setGray(this.rewardBtn.getComponent(Button), lockReward, lockReward);
    } else {
      this.ylqNode.active = false;
      this.rewardBtn.active = true;
      ButtonUtils.setGray(this.rewardBtn.getComponent(Button), lockReward, lockReward);
    }
    this.progressLabel.string = GoldUtils.muiltRate(itemData.progressCurrent) + "/" + GoldUtils.muiltRate(itemData.progressTotal)
    this.progressSprite.fillRange = progress;
    this.rewardLabel.string = GoldUtils.muiltRate(itemData.rewardGold) + "";
    this.lockReq = false;
  }
}