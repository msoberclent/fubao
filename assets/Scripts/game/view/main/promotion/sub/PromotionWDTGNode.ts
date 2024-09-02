import { Label, _decorator, isValid } from "cc";
import { GoldUtils } from "../../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../../constant/ServerConst";
import { PromotionBaseNode } from "./PromotionBaseNode";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import { DateSelectNode } from "../../hall/DateSelectNode";
import { Node } from "cc";
import { EditBox } from "cc";
const { ccclass, property } = _decorator;
/**
 * 我的推广
 */
@ccclass('PromotionWDTGNode')
export class PromotionWDTGNode extends PromotionBaseNode {

  isrecieved = false;
  respData: any;

  @PiterDirector.AUTO_BIND(Node)
  AT_StartTimeEdit: Node


  @PiterDirector.AUTO_BIND(Node)
  AT_Layout: Node

  @PiterDirector.AUTO_BIND(Node)
  AT_EndTimeEdit: Node

  createChildren() {
    super.createChildren();
    this.AT_StartTimeEdit.getComponent(DateSelectNode).initNowTime();
    this.AT_EndTimeEdit.getComponent(DateSelectNode).initNowTime();
    this.init();
  }

  public showUI(respData) {
    this.respData = respData;
    let labels = [
      { name: "newReg", label: "top/xzhy/value", desc: "新增会员", divGold: false },
      { name: "newActive", label: "top/hyrs/value", desc: "活跃人数", divGold: false },
      { name: "newFirstTopUp", label: "top/scrs/value", desc: "首充人数", divGold: false },
      { name: "newTopUpTimes", label: "top/zcrc/value", desc: "总充人次", divGold: false },

      { name: "newTopUp", label: "top/czje/value", desc: "充值金额", divGold: true },
      { name: "newAllFlow", label: "top/yeji/value", desc: "业绩", divGold: true },
      { name: "newIncome", label: "top/yongjin/value", desc: "佣金", divGold: true },
      { name: "totalEffectExpect", label: "top/jryg/value", desc: "今日预估佣金", divGold: true },

      { name: "allNum", label: "tuandui/zrs/value", desc: "总人数", divGold: false },
      { name: "directNum", label: "tuandui/zsrs/value", desc: "直属人数", divGold: false },
      { name: "teamNum", label: "tuandui/tdrs/value", desc: "团队人数", divGold: false },


      { name: "allFlow", label: "yeji/zyj/value", desc: "总业绩", divGold: true },
      { name: "directFlow", label: "yeji/zsyj/value", desc: "直属业绩", divGold: true },
      { name: "teamFlow", label: "yeji/tdyj/value", desc: "团队业绩", divGold: true },

      { name: "allIncome", label: "yongjin/zyj/value", desc: "总佣金", divGold: true },
      { name: "directIncome", label: "yongjin/zsyj/value", desc: "直属佣金", divGold: true },
      { name: "teamIncome", label: "yongjin/tdyj/value", desc: "团队佣金", divGold: true },
    ]

    for (let i = 0; i < labels.length; i++) {
      let item = labels[i];
      let node = this.AT_Layout.getChildByPath(item.label);
      if (node && item.name) {
        if (item.divGold) {
          node.getComponent(Label).string = GoldUtils.formatGold(this.respData[item.name] || 0);
        } else {
          node.getComponent(Label).string = this.respData[item.name]
        }
      }
    }
  }

  lastSeachKey: string;
  AT_CXBtnTouch() {
    this.init();
  }

  public async init() {
    let startTime = this.AT_StartTimeEdit.getComponent(EditBox).string.trim()
    let endTime = this.AT_EndTimeEdit.getComponent(EditBox).string.trim()
    if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
      DefaultToast.instance.showScrollText("开始时间必须小于结束时间");
      return;
    }
    let searchKey = `${startTime}_${endTime}`;
    if (this.lastSeachKey == searchKey) {
      return;
    }
    this.lastSeachKey = searchKey;
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-ext-overview", {
      startTime: startTime,
      endTime: endTime,
    }, true);
    if (data.code == 200 && isValid(this.node)) {
      this.showUI(data.data);
      // this.isInited = true;
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }


}