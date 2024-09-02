import { Component, Label, _decorator } from "cc";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { BankCardUtils } from "../../../../../Piter.Framework/UIKit/Util/BankCardUitls";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameEvent } from "../../../model/event/GameEvent";
import { GameUtils } from "../../../utils/GameUtils";

const { ccclass, property } = _decorator;
@ccclass('WithdrawAccountItem')
export class WithdrawAccountItem extends Component {

    data: any = null;
    isChoose = false;
    setData(data) {
        this.data = data;
        if (data.type == 0) {
            this.node.getChildByName("name").getComponent(Label).string = JSON.parse(data.notes).bankName;
            this.node.getChildByPath("acc/name").getComponent(Label).string = BankCardUtils.jiamiCard(data.accountAddr);
        } else if (data.type == 3) {
            this.node.getChildByName("name").getComponent(Label).string = data.provider;
            this.node.getChildByPath("acc/name").getComponent(Label).string = data.accountAddr;
        } else if (data.type == 2) {
            this.node.getChildByName("name").getComponent(Label).string = data.provider;
            this.node.getChildByPath("acc/name").getComponent(Label).string = data.accountAddr;
        } else if (data.type == 7) {
            this.node.getChildByName("name").getComponent(Label).string = data.realName;
            this.node.getChildByPath("acc/name").getComponent(Label).string = data.accountAddr;
        } else {
            this.node.getChildByName("name").getComponent(Label).string = data.provider;
            this.node.getChildByPath("acc/name").getComponent(Label).string = data.accountAddr;
        }

    }

    onBtnCopy() {
        GameUtils.setClipBordStr(this.data.accountAddr)
    }

    async onBtnDelete() {
        DefaultAlertView.addAlert("请确认移除账户?", async () => {
            let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/cash-account-del", { id: this.data.id });
            if (resp.code == 200) {
                GamePlayerManager.instance.withdrawMethod = resp.data;
                this.data = null;
                DefaultToast.instance.showText("删除成功", resp.msg)
                this.node.active = false;
                Global.EVENT.dispatchEvent(GameEvent.WITH_METHOD_UPDATE);
            }else{
                DefaultToast.instance.showText(resp.msg)
            }

        }, null, false)
    }

    onBtnXuanzhong() {
        this.isChoose = !this.isChoose;
        // if (this.isChoose) {
        //     ImageUtils.showImage(this.node.getChildByName("kefu_bar_bg").getComponent(Sprite), "altas/bank/recharge_tab_bg1");
        // } else {
        //     ImageUtils.showImage(this.node.getChildByName("kefu_bar_bg").getComponent(Sprite), "altas/kefu/kefu_bar_bg");
        // }
    }
}