
import { Color, Label, Node, ScrollView, Sprite, _decorator, instantiate, v3 } from 'cc';
import { BaseEvent } from '../../../../../../Piter.Framework/BaseKit/Constant/BaseEvent';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { ButtonSpriteChange } from '../../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange';
import { GridItemAni } from '../../../../../../Piter.Framework/UIKit/Component/grid/GridItemAni';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import ButtonUtils from '../../../../../../Piter.Framework/UIKit/Util/ButtonUtils';
import { ColorConst } from '../../../../constant/GameResConst';
import { ServerConfig } from '../../../../constant/ServerConst';
import { GamePlayerManager } from '../../../../manager/GamePlayerManager';
import { PromotionBaseNode } from './PromotionBaseNode';
const { ccclass, property } = _decorator;
/**
 * 业绩查询
 */
@ccclass('PromotionMRSYNode')
export class PromotionMRSYNode extends PromotionBaseNode {

  @PiterDirector.AUTO_BIND(Node)
  AT_RecordItem: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_shouyiRecordSc: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_RecieveBtn: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_MessageNode: Node;

  public async init() {
    this.requestMyShouyi();
  }
  /**
     *业绩查询
     */
  async requestMyShouyi() {
    this.AT_shouyiRecordSc.getComponent(ScrollView).content.destroyAllChildren();
    let uid = GamePlayerManager.instance.player.simpleUser.uid;
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/dailyReward/daily-reward-detail", { uid: uid }, true);
    if (data.code == 200) {
      this.AT_MessageNode.getChildByName("id").getComponent(Label).string = data.data.uid;
      this.AT_MessageNode.getChildByName("todayFlow").getComponent(Label).string = GoldUtils.formatGold(data.data.todayFlow);
      this.AT_MessageNode.getChildByName("todayFlowYugu").getComponent(Label).string = GoldUtils.formatGold(data.data.todayRewardYuGu);
      this.AT_MessageNode.getChildByName("yestodayFlow").getComponent(Label).string = GoldUtils.formatGold(data.data.yesterdayFlow);
      this.AT_MessageNode.getChildByName("testodayBenifit").getComponent(Label).string = GoldUtils.formatGold(data.data.yesterdayReward);
      let recive = data.data.yesterdayReceiveStatus == 0 ? false : true;
      ButtonUtils.setGray(this.AT_RecieveBtn.getComponent(Sprite), recive);
      let list = data.data.recordList;
      for (let i = 0; i < list.length; i++) {
        let v = instantiate(this.AT_RecordItem);
        v.active = true;
        v.setParent(this.AT_shouyiRecordSc.getComponent(ScrollView).content);
        v.setPosition(v3(0, 0))
        v.getChildByName("time").getComponent(Label).string = list[i].dayStr;//list[i].receiveStatus == 0 ? "-" : list[i].receiveTime
        v.getChildByName("cnt").getComponent(Label).string = "金额:" + GoldUtils.formatGold(list[i].effectAmount);
        v.getChildByName("state").getComponent(Label).string = list[i].receiveStatus == 0 ? "未领取" : "已领取";
        v.getChildByName("state").getComponent(Label).color = list[i].receiveStatus == 0 ? new Color().fromHEX(ColorConst.RED) : new Color().fromHEX(ColorConst.GREEN);
        if (i % 2 == 0) {
          v.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
        } else {
          v.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
        }
        v.getComponent(GridItemAni).startAnimation(i);
      }
    }

  }

  async AT_RecieveBtnTouch() {
    let uid = GamePlayerManager.instance.player.simpleUser.uid;
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/dailyReward/daily-reward-receive", { uid: uid });
    if (data.code == 200) {
      DefaultToast.instance.showText("领取成功", data.msg);
      ButtonUtils.setGray(this.AT_RecieveBtn.getComponent(Sprite), true);
      GamePlayerManager.instance.player.gold = data.data.gold;
      Global.EVENT.dispatchEvent(BaseEvent.GOLD_FLUSH);
      this.requestMyShouyi();
    } else {
      DefaultToast.instance.showText(data.msg);
    }

  }
}