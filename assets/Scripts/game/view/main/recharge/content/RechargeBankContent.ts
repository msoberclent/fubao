import { EditBox, Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ValidateUtils } from "../../../../../../Piter.Framework/UIKit/Util/ValidateUtils";
import { ServerConfig } from "../../../../constant/ServerConst";
import { RechargeMethodItem } from "../../../../message/GameMessage";
import { GameUtils } from "../../../../utils/GameUtils";
import { BaseRechargeContent } from "./BaseRechargeContent";

const { ccclass, property } = _decorator;
@ccclass('RechargeBankContent')
export class RechargeBankContent extends BaseRechargeContent {

  @PiterDirector.AUTO_BIND(Node)
  AT_Bank1: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_Bank2: Node;

  @PiterDirector.AUTO_BIND(EditBox)
  AT_BankerNameEdit: EditBox;

  @PiterDirector.AUTO_BIND(EditBox)
  AT_GoldEdit: EditBox;

  @PiterDirector.AUTO_BIND(EditBox)
  AT_BankLSEdit: EditBox;




  async onShowUI(method: RechargeMethodItem) {
    this.AT_Bank2.active = false;
    this.AT_Bank1.active = true;
    await super.onShowUI(method);
    this.showContent();
    this.lockReq = false;
  }


  rechargeAmount: number;
  trueName: string;
  AT_BankStep1BtnTouch() {
    if (this.channelList.length == 0) {
      DefaultToast.instance.showText("暂无银行卡充值渠道");
      return;
    }
    let amount = Number(this.AT_GoldEdit.string);
    if (isNaN(amount) || amount < 30 || amount > 40000) {
      DefaultToast.instance.showText("充值金额错误")
      return;
    }
    let trueName = this.AT_BankerNameEdit.string;
    if (!ValidateUtils.isChineseName(trueName)) {
      DefaultToast.instance.showText("请输入正确的真实姓名");
      return;
    }
    this.rechargeAmount = amount;
    this.trueName = trueName;
    this.AT_Bank2.active = true;
    this.AT_Bank1.active = false;
    this.showBankStep2();
  }

  showBank1() {
    this.rechargeAmount = null;
    this.trueName = null;
    this.AT_Bank1.active = true;
    this.AT_Bank2.active = false;
    this.AT_GoldEdit.string = ""
    this.AT_BankerNameEdit.string = ""
  }


  public async AT_BankZTBtnTouch() {
    let str = await GameUtils.getClipBoardStr();
    if (!str) {
      return;
    }
    this.AT_BankLSEdit.string = str;
  }

  public AT_RefushBtnTouch() {
    this.showBankStep2();
  }

  public async AT_BankEnterBtnTouch() {
    if (this.lockReq) {
      return;
    }
    let orderId = this.AT_BankLSEdit.string;
    if (orderId.trim().length < 1) {
      DefaultToast.instance.showText("请输入充值流水号或者订单号");
      return;
    }
    let reqData = {
      amount: this.rechargeAmount * 100,
      channelId: this.currentSelectChannelData.id,
      platOrder: orderId,
      realName: this.trueName,
    }
    this.lockReq = true;
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/create-order", reqData, true);
    if (resp.code == 200) {
      DefaultToast.instance.showText("充值请求已经提交", resp.msg);
      this.scheduleOnce(() => {
        this.lockReq = false;
      }, 2)
      this.showBank1();
    } else {
      this.lockReq = false;
      DefaultToast.instance.showText(resp.msg);
    }
  }


  showBankStep2() {

    this.currentSelectChannelData = _.shuffle(this.channelList)[0];
    this.showCurrentSelect();
  }

  public showCurrentSelect() {
    let data = [
      this.currentSelectChannelData.bankCardName,
      this.currentSelectChannelData.bankCardAccount,
      this.rechargeAmount,
      this.currentSelectChannelData.bankCardProvider,
      this.currentSelectChannelData.bankCardProviderBranch,
    ]
    for (let i = 1; i <= 5; i++) {
      let eidtBox = this.AT_Bank2.getChildByPath(`item${i}/edit`).getComponent(EditBox);
      eidtBox.string = data[i - 1];
      eidtBox.enabled = false;
    }
  }

  currentSelectChannelData;
  showContent() {
    this.AT_BankerNameEdit.string = "";
    this.AT_GoldEdit.string = ""
  }
}