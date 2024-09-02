import { EditBox, Label, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameEvent } from "../../../model/event/GameEvent";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { UserSafeSettingPanel } from "../user/UserSafeSettingPanel";
const { ccclass, property } = _decorator;
@ccclass('ZFBAddPanel')
export class ZFBAddPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "bank/prefabs/ZFBAddPanel";

    protected static className = "ZFBAddPanel";

    private lockReq: boolean = false;
    @PiterDirector.AUTO_BIND(Label)
    AT_nameLabel: Label

    @PiterDirector.AUTO_BIND(EditBox)
    AT_CardEdit: EditBox

    public createChildren(): void {
        super.createChildren();
        this.AT_nameLabel.string = GamePlayerManager.instance.player.realName;
    }

    AT_BackBtnTouch() {
        Global.UI.closeView(ZFBAddPanel);
    }

    async AT_EnterBtnTouch() {
        if (!GamePlayerManager.instance.player.realName) {
            return Global.UI.openView(UserSafeSettingPanel);
        }
        let card = this.AT_CardEdit.string;
        if (card.trim().length < 1) {
            DefaultToast.instance.showText("请输入正确的收款地址");
            return;
        }
        let withdrawMethod = await GamePlayerManager.instance.getMineWithdrawMethodByType(7);
        let data = {
            type: 7,
            realName: this.AT_nameLabel.string,
            notes: "",
            accountAddr: card,
            provider: "支付宝",
            isdefault: withdrawMethod.length == 0 ? 1 : 0
        }
        if (this.lockReq) {
            return;
        }
        this.lockReq = true;
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/withdrawal/cash-account-add", data, true);
        if (resp.code == 200) {
            DefaultToast.instance.showText("添加成功", resp.msg);
            let all = await GamePlayerManager.instance.getMineWithdrawMethod();
            all.push(resp.data);
            Global.EVENT.dispatchEvent(GameEvent.WITH_METHOD_UPDATE);
            Global.UI.closeView(ZFBAddPanel)
        } else {
            this.lockReq = false;
            DefaultToast.instance.showText(resp.msg)
        }
    }
}