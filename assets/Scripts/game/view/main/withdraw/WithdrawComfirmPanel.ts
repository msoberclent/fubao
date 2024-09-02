import { Label, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ExampleLogin
 * DateTime = Wed Jan 26 2022 17:19:38 GMT+0800 (中国标准时间)
 * 提现确认
 */
@ccclass('WithdrawComfirmPanel')
export class WithdrawComfirmPanel extends ScrollToLeftInPanel {

  protected static prefabUrl = "bank/prefabs/WithdrawComfirmPanel";

  protected static className = "WithdrawComfirmPanel";

  AT_CloseBtnTouch() {
    Global.UI.closeView(WithdrawComfirmPanel)
  }

  /**
   * 提现金额
   */
  @PiterDirector.AUTO_BIND(Label)
  AT_MoneyLabel: Label;

  /**
   * 手续费
   */
  @PiterDirector.AUTO_BIND(Label)
  AT_SxfLabel: Label;

  /**
   * 到账数
   */
  @PiterDirector.AUTO_BIND(Label)
  AT_GainLabel: Label;

  /**
   * USDT实时汇率
   */
  @PiterDirector.AUTO_BIND(Label)
  AT_USDTHLLabel: Label;

  /**
   *  到账USDT数量数
   */
  @PiterDirector.AUTO_BIND(Label)
  AT_GetUSDTLabel: Label;


  public createChildren() {
    super.createChildren();
    // let reqData = {
    //   accountId: this.selectCardData.id,
    //   amount: amount
    // }
    let free = this.paramsData.withdrawConfig.feeRate[this.paramsData.type];
    let amount = this.paramsData.reqData.amount
    let shouxufei = Number(new Big(amount).mul(new Big(free)).round(2, 0));
    let shiji = amount - shouxufei;

    this.AT_MoneyLabel.string = this.paramsData.reqData.amount;
    this.AT_SxfLabel.string = GoldUtils.toFixed(shouxufei, 2).toString();
    this.AT_GainLabel.string = GoldUtils.toFixed(shiji, 2).toString()
    if (this.paramsData.type == 1) {
      this.AT_USDTHLLabel.node.parent.active = this.AT_GetUSDTLabel.node.parent.active = true;
      //todo 汇率
      this.AT_USDTHLLabel.string = this.paramsData.withdrawConfig.ustdRate + "";
      this.AT_GetUSDTLabel.string = GoldUtils.toFixed((shiji / this.paramsData.withdrawConfig.ustdRate), 2) + ""
    } else {
      this.AT_USDTHLLabel.node.parent.active = this.AT_GetUSDTLabel.node.parent.active = false
    }
  }

  private lockReq: boolean = false;
  AT_EnterBtnTouch() {
    this.lockReq = true;
    this.paramsData.callback && this.paramsData.callback();
    this.AT_CloseBtnTouch();
  }
}