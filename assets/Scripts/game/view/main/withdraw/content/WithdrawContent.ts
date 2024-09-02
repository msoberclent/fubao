import { Node, Toggle, _decorator } from "cc";
import { PiterUI } from "../../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { WithdrawPanel } from "../WithdrawPanel";
import { WithdrawBankContent } from "./WithdrawBankContent";
import { WithdrawNumberContent } from "./WithdrawNumberContent";
import { WithdrawZFBContent } from "./WithdrawZFBContent";
const { ccclass, property } = _decorator;
@ccclass('WithdrawContent')
export class WithdrawContent extends PiterUI {

  // public withdrawConfig: WithdrawConfig;

  @property(Node)
  AT_BankContent: Node = null;
  @property(Node)
  AT_NumberContent: Node = null;
  @property(Node)
  AT_ZFBContent1: Node = null;
  @property(Node)
  AT_Head: Node = null;

  father: WithdrawPanel;
  config = null;
  onInit(father, config) {
    this.father = father;
    this.config = config;
    if (!this.AT_Head.getChildByName("card").active) {
      this.AT_Head.getChildByName("numberic").getComponent(Toggle).isChecked = true;
      this.onHeadSwitch(null, "2");
    } else {
      this.onHeadSwitch(null, "1");
    }
  }
  createChildren() {
    super.createChildren();
    // this.onHeadSwitch(null, "1");
  }

  onHeadSwitch(e, custom) {
    this.AT_BankContent.active = this.AT_NumberContent.active = this.AT_ZFBContent1.active = false;
    switch (custom) {
      case "1":
        this.AT_BankContent.active = true;
        this.AT_BankContent.getComponent(WithdrawBankContent).onInit(this, this.config);
        break;
      case "2":
        this.AT_NumberContent.active = true;
        this.AT_NumberContent.getComponent(WithdrawNumberContent).onInit(this, this.config);
        break;
      case "3":
        this.AT_ZFBContent1.active = true;
        this.AT_ZFBContent1.getComponent(WithdrawZFBContent).onInit(this, this.config);
        break;
    }
  }


}


export interface WithdrawConfig {
  amountLimit: number
  feeRate: any
  ustdRate: number
}