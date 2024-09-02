import { EditBox, _decorator } from "cc";
import { BaseEvent } from "../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { PiterDirector } from "../../../../Piter.Framework/PiterDirector";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../constant/ServerConst";
import { GamePlayerManager } from "../../manager/GamePlayerManager";
import { ScrollToLeftInPanel } from "../panel/ScrollToLeftInPanel";

const { ccclass, property } = _decorator;

@ccclass('BindRealNamePanel')
export class BindRealNamePanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "hall/prefabs/BindRealNamePanel";

    protected static className = "BindRealNamePanel";

    @PiterDirector.AUTO_BIND(EditBox)
    AT_input1: EditBox;
    phonenum = "";
    callback = null;
    father = null;

    public createChildren(): void {
        super.createChildren();
    }

    init(paramsData) {
        if (paramsData && paramsData.father) {
            this.father = paramsData.father;
        }
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    async AT_comfirmBtnTouch() {
        if (this.AT_input1.string == "") {
            DefaultToast.instance.showText("请输入姓名");
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/update-realName", { realName: this.AT_input1.string });
        if (data.code == 200) {
            DefaultToast.instance.showText("绑定成功", data.msg);
            GamePlayerManager.instance.player.realName = this.AT_input1.string.trim();
            Global.EVENT.dispatchEvent(BaseEvent.GOLD_FLUSH, {
                playerData: GamePlayerManager.instance.player
            });
            if (this.father) {
                this.father.updateRealName(this.AT_input1.string);
            }
            this.AT_closeBtnTouch();
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    AT_closeBtnTouch(): void {
        this.callback && this.callback();
        this.father.initUI();
        Global.UI.closeView(BindRealNamePanel);
    }
}