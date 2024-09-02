import { Color, Component, Label, Sprite, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ColorConst } from "../../../constant/GameResConst";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 龙虎斗玩家列表
 */
@ccclass('RechargeRecordItem')
export class RechargeRecordItem extends Component {

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
  remarkLabel: Label = null;

  public updateItem(itemData, index) {
    this.timeLabel.string = itemData.createStamp;
    if (index % 2 == 0) {
      ImageUtils.showImage(this.node.getComponent(Sprite), "common/res/panel/common_item_bar_bg2")
    }
    this.showTypeByModelId(itemData.modeKey);
    this.afterLabel.string = GoldUtils.formatGold(itemData.balanceAfter);
    this.goldLabel.string = GoldUtils.formatGold(itemData.amount);
    this.beforeLabel.string = GoldUtils.formatGold(itemData.balanceBefore);
    this.showStatusLabel(itemData.orderState);
    if (this.remarkLabel) {
      if (itemData.notes) {
        this.remarkLabel.string = itemData.note
      } else {
        this.remarkLabel.string = `-`
      }
    }
  }

  public showStatusLabel(status) {
    if (status == 5) {
      this.statusLabel.string = "已到账";
      this.statusLabel.color = new Color().fromHEX(ColorConst.GREEN)
    } else if (status == 3) {
      this.statusLabel.string = "已拒绝";
      this.statusLabel.color = new Color().fromHEX(ColorConst.RED)
    } else {
      this.statusLabel.string = "待到账";
      this.statusLabel.color = new Color().fromHEX(ColorConst.BLUE)
    }
  }

  public showTypeByModelId(modelId) {
    let str;
    switch (modelId) {
      case "wx":
        str = "微信";
        break;
      case "zfb":
        str = "支付宝";
        break;
      case "yhk":
      case "yhk_dc":
        str = "银行卡";
        break;
      case "usdt":
      case "usdt_dc":
        str = "USDT";
        break;
      case "rgcz":
        str = "人工充值";
        break;
      case "ysf":
        str = "云闪付";
        break;
      case "okpay":
        str = "OKPay";
        break;
      case "szrmb":
        str = "数字人民币";
        break;
      case "topay":
        str = "TOPay";
        break;
      case "wanb":
        str = "万币钱包"
        break;
      case "kdpay":
        str = "K豆支付"
        break;
      case "kdpay":
        str = "K豆支付"
        break;
      case "btpay":
        str = "币通钱包"
        break;
      default:
        str = "未知";
        break;

    }
    this.typeLabel.string = str;
  }
}