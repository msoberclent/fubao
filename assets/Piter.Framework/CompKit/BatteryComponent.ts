import { Label, Sprite, _decorator, macro, sys } from "cc";
import { GameUtils } from "../../Scripts/game/utils/GameUtils";
import { DateTimeManager } from "../BaseKit/Manager/DateTimeManager";
import { TimeUtils } from "../BaseKit/Util/TimeUtils";
import { PiterUI } from "../UIKit/Base/PiterUI";


const { ccclass, property } = _decorator;

@ccclass
export default class BatteryComponent extends PiterUI {

  dotSprite: Sprite;

  timeLabel: Label;

  createChildren() {
    super.createChildren();
    this.dotSprite = this.node.getChildByName("dot").getComponent(Sprite);
    this.timeLabel = this.node.getChildByName("time").getComponent(Label);
    this.initBattery();
    this.updateBatteryInfo();
    this.schedule(this.updateBatteryInfo, 10, macro.REPEAT_FOREVER, 0);
  }

  public initBattery() {
    let flag = true;
    if (sys.isBrowser && !sys.isMobile) {
      flag = false;
    } else {
      flag = GameUtils.checkBatteryInit();
    }
    this.node.active = flag;
  }

  public updateBatteryInfo() {
    let serverTime = DateTimeManager.instance.now
    this.timeLabel.string = TimeUtils.dateFormatMS("hh:mm", serverTime);
  }
}
