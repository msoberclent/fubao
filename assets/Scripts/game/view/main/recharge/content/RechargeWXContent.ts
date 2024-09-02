import { Color, EditBox, EventHandler, Label, Node, Toggle, _decorator } from "cc";
import { GoldUtils } from "../../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../../constant/ServerConst";
import { RechargeMethodItem } from "../../../../message/GameMessage";
import { GameUtils } from "../../../../utils/GameUtils";
import { BaseRechargeContent } from "./BaseRechargeContent";

const { ccclass, property } = _decorator;
@ccclass('RechargeWXContent')
export class RechargeWXContent extends BaseRechargeContent {

  @PiterDirector.AUTO_BIND(Node)
  AT_ItemTab: Node = null;;

  @PiterDirector.AUTO_BIND(Node)
  AT_GoldTab: Node = null;;

  @PiterDirector.AUTO_BIND(Node)
  AT_GoldEditBox: Node = null;

  @PiterDirector.AUTO_BIND(Node)
  AT_EnterBtn: Node = null;;


  async onShowUI(method: RechargeMethodItem) {
    await super.onShowUI(method);
    this.showContent();
    this.lockReq = false;
  }

  async AT_EnterBtnTouch() {
    if (this.lockReq) {
      return;
    }
    let amount = Number(this.AT_GoldEditBox.getComponent(EditBox).string);
    // if (!this.currentSelectChannelData || !this.currentSelectAmountData) {
    //   DefaultToast.instance.showText("请选择正确的充值方式和金额");
    //   return;
    // }
    if (isNaN(amount) || amount < 1) {
      DefaultToast.instance.showText("请选择充值金额");
      return;
    }
    let reqData = {
      amount: amount * GoldUtils.GOLD_RATE_MUL,
      channelId: this.currentSelectChannelData.id
    }
    this.lockReq = true;
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/create-order", reqData, true);
    if (resp.code == 200) {
      if (resp.data.url) {
        DefaultToast.instance.showText("充值请求已经提交", resp.msg);
        GameUtils.goUrl(resp.data.url);
      }
      this.scheduleOnce(() => {
        this.lockReq = false;
      }, 2)
    } else {
      this.lockReq = false;
      DefaultToast.instance.showText(resp.msg);
    }
  }

  public showAmounsItem() {
    let amountList = this.currentSelectChannelData.amountList;
    if (!amountList) {
      amountList = [];
    }
    for (let i = 1; i <= 10; i++) {
      let amountData = amountList[i - 1];
      let node = this.AT_GoldTab.getChildByName("item" + i);
      node.active = amountData != null;
      this.registerGoldItemClick(node)
      node.getComponent(Toggle).clickEvents[0].customEventData = (i - 1) + "";
      node.getComponent(Toggle).isChecked = false;
      if (amountData) {
        this.showAmountTabItem(node, amountData)
      }
    }
    if (amountList[0]) {
      this.AT_GoldEditBox.getComponent(EditBox).string = "";
    }
  }


  showAmountTabItem(node, amountData) {
    node.getChildByName("label").getComponent(Label).string = GoldUtils.formatGold(amountData.amount, 0);
  }

  public onWxGoldTabItemTouch(e, index) {
    this.currentSelectAmountData = this.currentSelectChannelData.amountList[index]
    this.AT_GoldEditBox.getComponent(EditBox).string = GoldUtils.formatGold(this.currentSelectAmountData.amount);
  }


  public wxItemTabTouch(e, index) {
    let channelData = this.channelList[index];
    this.currentSelectChannelData = channelData;
    //
    this.showAmounsItem();
  }


  public registerTabItemClick(node: Node) {
    const clickEventHandler = new EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = 'RechargeWXContent';//组件名
    clickEventHandler.handler = 'wxItemTabTouch'; //回调函数名字
    const button = node.getComponent(Toggle);
    button.clickEvents[0] = clickEventHandler
  }

  public registerGoldItemClick(node: Node) {
    const clickEventHandler = new EventHandler();
    clickEventHandler.target = this.node;
    clickEventHandler.component = 'RechargeWXContent';//组件名
    clickEventHandler.handler = 'onWxGoldTabItemTouch'; //回调函数名字
    const button = node.getComponent(Toggle);
    button.clickEvents[0] = clickEventHandler
  }

  public itemTabYesColor = new Color().fromHEX("A05300")
  public itemTabNoColor = new Color().fromHEX("FFFFFF")
  showContent() {
    this.AT_GoldEditBox.getComponent(EditBox).string = ""
    // this.method
    if (!this.channelList) {
      this.channelList = [];
    }
    for (let i = 1; i <= 8; i++) {
      let channelData = this.channelList[i - 1];
      let node = this.AT_ItemTab.getChildByName("item" + i);
      this.registerTabItemClick(node);
      node.getComponent(Toggle).clickEvents[0].customEventData = (i - 1) + "";
      node.active = channelData != null;
      // node.getChildByPath("no/label").getComponent(Label).color = this.itemTabNoColor;
      // node.getChildByPath("select/label").getComponent(Label).color = this.itemTabYesColor;
      // node.getChildByPath("free/label").getComponent(Label).color = this.itemTabYesColor;
      if (channelData) {
        this.showTabItem(node, channelData)
      }
    }
    if (this.channelList.length > 0) {
      this.wxItemTabTouch(null, 0);
    }

    if (this.rechargeActivityVo) {
      this.joinHd();
    } else {
      this.AT_huodong.active = false;
    }
  }

  currentSelectChannelData;
  currentSelectAmountData;
  showTabItem(node: Node, channelData) {
    node.getChildByPath("no/label").getComponent(Label).string = channelData.channelName;
    node.getChildByPath("select/label").getComponent(Label).string = channelData.channelName;
    if (channelData.feeRate) {
      let feeNode = node.getChildByName("free");
      if (feeNode) {
        let free = Number(new Big(channelData.feeRate).mul(100));
        feeNode.getChildByName("label").getComponent(Label).string = "-" + free + "%"
        feeNode.active = true;
      }
    }
  }

  onContentChange() {
    this.AT_GoldEditBox.getComponent(EditBox).string = "";
  }
}


