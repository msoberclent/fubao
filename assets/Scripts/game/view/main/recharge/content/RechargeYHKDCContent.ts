import { EditBox, Node, _decorator } from "cc";
import { GoldUtils } from "../../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ValidateUtils } from "../../../../../../Piter.Framework/UIKit/Util/ValidateUtils";
import { ServerConfig } from "../../../../constant/ServerConst";
import { GameUtils } from "../../../../utils/GameUtils";
import { RechargeWXContent } from "./RechargeWXContent";

const { ccclass, property } = _decorator;
@ccclass('RechargeYHKDCContent')
export class RechargeYHKDCContent extends RechargeWXContent {

  @PiterDirector.AUTO_BIND(Node)
  AT_NameEditBox: Node = null;


  async AT_EnterBtnTouch() {
    if (this.lockReq) {
      return;
    }
    let amount = Number(this.AT_GoldEditBox.getComponent(EditBox).string);
    if (isNaN(amount) || amount < 1) {
      DefaultToast.instance.showText("请选择充值金额");
      return;
    }
    let realName = this.AT_NameEditBox.getComponent(EditBox).string.trim();
    if (!ValidateUtils.isChineseName(realName)) {
      DefaultToast.instance.showText("请输入正确的银行卡真实姓名");
      return;
    }
    let reqData = {
      amount: amount * GoldUtils.GOLD_RATE_MUL,
      channelId: this.currentSelectChannelData.id,
      realName: realName,
      type: this.activityType,
      id: this.selectHuodongId
    }
    this.lockReq = true;
    let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge/create-order", reqData, true);
    if (resp.code == 200) {
      if (resp.data.url) {
        GameUtils.setClipBordStr(resp.data.url, "充值请求已经提交")
        GameUtils.goUrl(resp.data.url);
        DefaultAlertView.addAlert("已为您打开对应的支付软件!如果未能打开，请在手机自带的浏览器中粘贴我们已经为您复制好的充值链接进行充值。")
      }
      this.scheduleOnce(() => {
        this.lockReq = false;
      }, 2)
    } else {
      this.lockReq = false;
      DefaultToast.instance.showText(resp.msg);
    }
  }
}
