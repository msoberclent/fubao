import { Color, Component, Label, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { ColorConst } from "../../../constant/GameResConst";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 龙虎斗玩家列表
 */
@ccclass('WIthdrawRecordItem')
export class WIthdrawRecordItem extends Component {
  @property(Label)
  timeLabel: Label = null;

  @property(Label)
  typeLabel: Label = null;

  @property(Label)
  beforeLabel: Label = null;

  @property(Label)
  goldLabel: Label = null;

  @property(Label)
  afterLabel: Label = null;

  @property(Label)
  statusLabel: Label = null;

  @property(Label)
  tipsLabel: Label = null;

  public updateItem(itemData, index) {
    // if (index % 2 == 0) {
    //   ImageUtils.showImage(this.node.getComponent(Sprite), "common/res/panel/common_item_bar_bg2")
    // } else {
    //   ImageUtils.showImage(this.node.getComponent(Sprite), "common/res/panel/common_item_bar_bg3")
    // }
    this.timeLabel.string = itemData.createStamp;
    this.showAccountTypeLabel(itemData);
    this.afterLabel.string = GoldUtils.formatGold(itemData.balanceAfter);
    this.goldLabel.string = GoldUtils.formatGold(itemData.amount);
    this.beforeLabel.string = GoldUtils.formatGold(itemData.balanceBefore);
    if (itemData.notes && itemData.notes != "null") {
      this.tipsLabel.string = "备注：" + itemData.notes;
    } else {
      this.tipsLabel.string = "备注：";
    }
    this.showStatusLabel(itemData);
  }

  public showStatusLabel(itemData) {
    if (itemData.payState == 1 || itemData.proxyPayStatus == 0) {
      this.statusLabel.string = "已出款";
      // this.statusLabel.color = new Color().fromHEX(ColorConst.GREEN)
    } else if (itemData.auditState == 2 || itemData.payState == 2) {
      this.statusLabel.string = "已拒绝";
      // this.statusLabel.color = new Color().fromHEX(ColorConst.RED)
    } else {
      if (itemData.auditState == 1) {
        if (itemData.proxyPayStatus == 1) {
          this.statusLabel.string = "出款中";
          // this.statusLabel.color = new Color().fromHEX(ColorConst.NORMAL)
        } else {
          this.statusLabel.string = "已审核-待出款";
          // this.statusLabel.color = new Color().fromHEX(ColorConst.NORMAL)
        }
      } else {
        this.statusLabel.string = "审核中";
        // this.statusLabel.color = new Color().fromHEX(ColorConst.NORMAL)
      }
    }
  }

  public showAccountTypeLabel(itemData) {
    let text;
    switch (itemData.accountType) {
      case 0:
        text = "银行卡"; break;
      case 1:
        text = "USDT"; break
      case 3:
        text = "TOPay"; break
      case 2:
        text = "OKPay"; break
      case 4:
        text = "万币钱包"; break
      case 5:
        text = "K豆支付"; break
      case 6:
        text = "币通钱包"; break
      case 7:
        text = "支付宝"; break
    }
    this.typeLabel.string = text;
  }
}