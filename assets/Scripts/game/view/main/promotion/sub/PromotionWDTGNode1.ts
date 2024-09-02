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
@ccclass('PromotionWDTGNode1')
export class PromotionWDTGNode1 extends PromotionBaseNode {

  isrecieved = false;
  respData: any;

  @PiterDirector.AUTO_BIND(Node)
  AT_StartTimeEdit: Node

  createChildren() {
    super.createChildren();
    this.AT_StartTimeEdit.getComponent(DateSelectNode).initNowTime();
    this.init();
  }

  public showUI(respData) {
    this.respData = respData;
    // if (!GamePlayerManager.instance.player.phone || GamePlayerManager.instance.player.phone == "") {
    //   this.node.getChildByPath("content1/wdyqm").active = false;
    // }
    if (respData.effectLeft <= 0) {
      this.isrecieved = true;
    } else {
      this.isrecieved = false;
    }

    this.node.getChildByPath("contentNode/view/layout/mid/wdyqm/AT_WdyqmLabel").getComponent(Label).string = respData.extensionCode;
    this.node.getChildByPath("contentNode/view/layout/top/common_tab_bg3/jryg/AT_JrygLabel").getComponent(Label).string = GoldUtils.formatGold(respData.totalEffectExpect) == "" ? "0" : GoldUtils.formatGold(respData.totalEffectExpect);
    this.node.getChildByPath("contentNode/view/layout/top/common_tab_bg3/AT_lqyjBtn/AT_KlqyjLabel").getComponent(Label).string = GoldUtils.formatGold(respData.effectLeft);

    //2024-7-2
    this.node.getChildByPath("contentNode/view/layout/top/xjcy/AT_XjcyLabel").getComponent(Label).string = respData.directMemberCount  //下级成员
    this.node.getChildByPath("contentNode/view/layout/top/jrzc/AT_JrzcLabel").getComponent(Label).string = respData.directMemberCountNew // 今日注册
    this.node.getChildByPath("contentNode/view/layout/top/byzc/AT_ByzcLabel").getComponent(Label).string = respData.monthReg// 本月注册
    this.node.getChildByPath("contentNode/view/layout/top/byhy/AT_ByhyLabel").getComponent(Label).string = respData.monthActive// 本月活跃
    this.node.getChildByPath("contentNode/view/layout/mid/wdjb/AT_WdjbLabel").getComponent(Label).string = respData.lvName //? 我的级别
    this.node.getChildByPath("contentNode/view/layout/mid/ckje/AT_CkjeLabel").getComponent(Label).string = GoldUtils.formatGold(respData.monthTopUp)//? 存款金额
    this.node.getChildByPath("contentNode/view/layout/mid/tkje/AT_TkjeLabel").getComponent(Label).string = GoldUtils.formatGold(respData.monthWithdraw)// 提款金额
    this.node.getChildByPath("contentNode/view/layout/mid/tzls/AT_TzlsLabel").getComponent(Label).string = GoldUtils.formatGold(respData.allFlow)//? 投注流水
    this.node.getChildByPath("contentNode/view/layout/mid/zsy/AT_ZsyLabel").getComponent(Label).string = GoldUtils.formatGold(respData.allLostWin)//? 总输赢
    this.node.getChildByPath("contentNode/view/layout/mid/zjsy/AT_ZjsyLabel").getComponent(Label).string = GoldUtils.formatGold(respData.allGetLostWin)//? 总净输赢



  }

  lastSeachKey: string;
  AT_CXBtnTouch() {
    this.init();
  }

  type: number = 1
  public async init() {
    // if (this.isInited) {
    //   return;
    // }
    let dateTime = this.AT_StartTimeEdit.getComponent(EditBox).string.trim()
    let searchKey = `${this.type}_${dateTime}`;
    if (this.lastSeachKey == searchKey) {
      return;
    }
    this.lastSeachKey = searchKey;
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-ext-overview", {
      type: this.type,
      dateTime: dateTime
    }, true);
    if (data.code == 200 && isValid(this.node)) {
      this.showUI(data.data);
      // this.isInited = true;
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  /**
   * 领取佣金
   */
  async AT_lqyjBtnTouch() {
    if (this.isrecieved) return;
    let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/gain-reward", { rewardType: 1 });
    if (data.code == 200) {
      this.isrecieved = true;
      DefaultToast.instance.showText("领取成功,请注意查收", data.msg);
    } else {
      DefaultToast.instance.showText(data.msg);
    }
  }

  // //领取记录
  // async AT_reciveHistoryBtnTouch() {
  //   let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/gain-reward-log", {});
  //   if (data.code == 200) {
  //     let info = data.data.list;
  //     Global.UI.openView(PromotionAwardRecordPanel, info)
  //   } else {
  //     return DefaultToast.instance.showText(data.msg);
  //   }
  // }



  // AT_copylMycodeBtnTouch() {
  //   if (!GamePlayerManager.instance.player.phone || GamePlayerManager.instance.player.phone == "") {
  //     return Global.UI.openView(BindPhonePanel);
  //   }
  //   if (!GamePlayerManager.instance.player.parentCode || !GamePlayerManager.instance.player.parentId) {
  //     return Global.UI.openView(InviteCodePanel);
  //   }
  //   let mycode = GamePlayerManager.instance.player.code;
  //   GameUtils.setClipBordStr(mycode);
  // }

  AT_TabSwitchClick(e, custom) {
    this.type = Number(custom)
    this.init();
  }

  AT_YjTipBtnTouch() {
    this.node.getChildByPath("contentNode/view/layout/top/common_tab_bg3/AT_lqyjBtn/wdtg_button_yj_tip").active = !this.node.getChildByPath("contentNode/view/layout/top/common_tab_bg3/AT_lqyjBtn/wdtg_button_yj_tip").active;
  }

  AT_SyTipBtnTouch() {
    this.node.getChildByPath("contentNode/view/layout/mid/zjsy/wdtg_button_zsy_tip").active = !this.node.getChildByPath("contentNode/view/layout/mid/zjsy/wdtg_button_zsy_tip").active;
  }
}