import { EditBox, Label, Node, _decorator } from "cc";
import { GoldUtils } from "../../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { Utils } from "../../../../../../Piter.Framework/BaseKit/Util/Utils";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../../constant/ServerConst";
import { RechargeMethodItem } from "../../../../message/GameMessage";
import { GameUtils } from "../../../../utils/GameUtils";
import { BaseRechargeContent } from "./BaseRechargeContent";

const { ccclass, property } = _decorator;
@ccclass('RechargeUSDTContent')
export class RechargeUSDTContent extends BaseRechargeContent {

  @PiterDirector.AUTO_BIND(Node)
  AT_USDT1: Node;

  @PiterDirector.AUTO_BIND(Node)
  AT_USDT2: Node;

  @PiterDirector.AUTO_BIND(EditBox)
  AT_GoldEdit: EditBox;

  @PiterDirector.AUTO_BIND(EditBox)
  AT_USDTIDEdit: EditBox;


  @PiterDirector.AUTO_BIND(Node)
  AT_QRCode: Node;

  async onShowUI(method: RechargeMethodItem) {
    this.AT_USDT1.active = true;
    this.AT_USDT2.active = false;
    await super.onShowUI(method);
    this.showContent();
    this.lockReq = false;
  }

  AT_EnterBtnTouch() {
    let value = Number(this.AT_GoldEdit.string);
    if (isNaN(value)) {
      DefaultToast.instance.showText("请输入金额");
      return;
    }
    if (value < 105 || value > 50000) {
      DefaultToast.instance.showText("充值范围为105-50000");
      return;
    }
    this.rechargeAmount = value;
    this.AT_USDT1.active = false;
    this.AT_USDT2.active = true;
    this.showComfirm();
  }

  showComfirm() {
    if (this.channelList.length > 0) {
      this.onBtnSwitchPage(null, this.channelList[0].channelName)
    }
  }

  AT_USDTBackBtnTouch() {
    this.AT_GoldEdit.string = "";
    this.AT_USDT2.active = false;
    this.AT_USDT1.active = true;
  }

  showContent() {
    for (let i = 0; i < this.channelList.length; i++) {
      let channel = this.channelList[i];
      let node = this.node.getChildByPath("AT_USDT2/tab/" + channel.channelKey)
      node.active = true;
    }
    this.AT_GoldEdit.string = "";
    if (this.rechargeActivityVo) {
      this.joinHd();
    } else {
      this.node.getChildByPath("AT_USDT1/AT_huodong").active = false;
    }
  }

  rechargeAmount: number;
  currentChannel;
  needUsdt: number
  public showChanelInfo(key: string) {
    let data = this.getChannelByKey(key);
    if (data) {
      this.currentChannel = data;
      this.AT_USDTHLLabel.string = data.exchangeRate
      this.needUsdt = Number(new Big(this.rechargeAmount).div(data.exchangeRate).round(2, 0))
      this.AT_USDTNeedLabel.string = this.needUsdt + "";
      this.AT_USDT2GoldLabel.string = this.rechargeAmount + "";
      Utils.QRCreate(this.AT_QRCode, this.currentChannel.channelLine)
    }
  }

  public getChannelByKey(key: string) {
    for (let i = 0; i < this.channelList.length; i++) {
      if (this.channelList[i].channelName == key) {
        return this.channelList[i];
      }
    }
    return null;
  }


  onBtnSwitchPage(e, custom) {
    switch (custom) {
      case "ERC20":
        this.showChanelInfo(custom)
        break;
      case "OMNI":
        this.showChanelInfo(custom)
        break;
      case "TRC20":
        this.showChanelInfo(custom)
        break;
    }
  }

  @PiterDirector.AUTO_BIND(Label)
  AT_USDT2GoldLabel: Label;

  @PiterDirector.AUTO_BIND(Label)
  AT_USDTHLLabel: Label;

  @PiterDirector.AUTO_BIND(Label)
  AT_USDTNeedLabel: Label;

  showUSDT1() {
    this.AT_USDTBackBtnTouch();
  }

  public AT_CopyRechargeUrlBtnTouch() {
    let str = this.currentChannel.channelLine;
    GameUtils.setClipBordStr(str)
  }

  public async AT_USDTZTBtnTouch() {
    let str = await GameUtils.getClipBoardStr();
    this.AT_USDTIDEdit.string = str.trim();
  }


  async AT_USDTEnterBtnTouch() {
    if (this.lockReq) {
      return;
    }
    let order = this.AT_USDTIDEdit.string.trim();
    if (order.length < 1) {
      DefaultToast.instance.showText("请输入充值流水号或者订单号");
      return;
    }
    let reqData = {
      "amount": GoldUtils.toServerGold(this.rechargeAmount),
      "channelId": this.currentChannel.id,
      "platOrder": order,
      "usdtAmount": this.needUsdt,
      "type": this.activityType,
      "id": this.selectHuodongId
    }
    this.lockReq = true;
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/create-order", reqData, true);
    if (resp.code == 200) {
      DefaultToast.instance.showText("充值请求已经提交", resp.msg);
      this.scheduleOnce(() => {
        this.lockReq = false;
      }, 2)
      this.showUSDT1();
    } else {
      this.lockReq = false;
      DefaultToast.instance.showText(resp.msg);
    }

  }



}