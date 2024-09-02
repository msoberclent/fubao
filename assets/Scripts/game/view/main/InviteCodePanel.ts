import { EditBox, _decorator } from 'cc';
import { PiterDirector } from '../../../../Piter.Framework/PiterDirector';
import Global from '../../../../Piter.Framework/PiterGlobal';
import PiterPanel from '../../../../Piter.Framework/UIKit/Base/PiterPanel';
import { DefaultToast } from '../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../constant/ServerConst';
import { GamePlayerManager } from '../../manager/GamePlayerManager';
const { ccclass, property } = _decorator;

@ccclass('InviteCodePanel')
export class InviteCodePanel extends PiterPanel {
    protected static prefabUrl = "hall/prefabs/InviteCodePanel";

    protected static className = "InviteCodePanel";
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input3: EditBox = null;

    callfun = null;
    public createChildren(): void {
        super.createChildren();
        let inviteData = GamePlayerManager.instance.inviteData;
        if (inviteData && inviteData.bindData && inviteData.bindData.inviteCode) {
            this.AT_input3.string = inviteData.bindData.inviteCode;
            this.AT_input3.enabled = true;
        } else {
            this.AT_input3.enabled = true;
        }
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    init(paramsData: any): void {
        if (paramsData && paramsData.callback) {
            this.callfun = paramsData.callback;
        }
    }

    AT_closeBtnTouch() {
        this.callfun && this.callfun();
        Global.UI.closeView(InviteCodePanel);
    }

    onInviteCodeEdit(e, custom) {

    }

    async AT_bindBtnTouch() {
        let str = this.AT_input3.string;
        if (str != "") {
            let data = await Global.HTTP.sendGetRequestAsync(ServerConfig.PATH_CONFIG.http_server + `/api/extension/bind-relation?code=${str}&uid=${GamePlayerManager.instance.player.simpleUser.uid}`, {});
            if (data.code == 200) {
                await GamePlayerManager.instance.updatePlayerInfo()
                DefaultToast.instance.showText("绑定成功", data.msg);
                this.AT_closeBtnTouch();
            } else {
                DefaultToast.instance.showText(data.msg);
            }
        }
    }

}