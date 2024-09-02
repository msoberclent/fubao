import { EditBox, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameEvent } from "../../../model/event/GameEvent";
import { GameUtils } from "../../../utils/GameUtils";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
const { ccclass, property } = _decorator;
@ccclass('NumberAddPanel')
export class NumberAddPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "bank/prefabs/NumberAddPanel";

    protected static className = "NumberAddPanel";

    private lockReq: boolean = false;

    private curSelectType: string = "TRC20"

    @PiterDirector.AUTO_BIND(EditBox)
    AT_CardEdit: EditBox

    public createChildren(): void {
        super.createChildren();
    }


    public async AT_ZTBtnTouch() {
        let str = await GameUtils.getClipBoardStr();
        if (!str) {
            return;
        }
        this.AT_CardEdit.string = str;
    }

    public onToggleTouch(e, curstorm) {
        this.curSelectType = curstorm;
    }

    AT_BackBtnTouch() {
        Global.UI.closeView(NumberAddPanel);
    }

    async AT_EnterBtnTouch() {
        let card = this.AT_CardEdit.string;
        if (card.trim().length < 1) {
            DefaultToast.instance.showText("请输入正确的收款地址");
            return;
        }
        if (this.curSelectType != "OMNI" && this.curSelectType != "TRC20") {
            DefaultToast.instance.showText("暂不支持的收款方式");
            return;
        }

        let withdrawMethod = await GamePlayerManager.instance.getMineWithdrawMethodByType(1);
        let data = {
            type: 1,
            realName: "",
            provider: this.curSelectType,
            notes: "",
            accountAddr: card,
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
            Global.UI.closeView(NumberAddPanel)
        } else {
            this.lockReq = false;
            DefaultToast.instance.showText(resp.msg)
        }
    }
}