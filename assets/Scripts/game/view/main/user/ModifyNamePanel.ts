import { EditBox, Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { UserCenterUI } from "./UserCenterUI";


const { ccclass, property } = _decorator;

@ccclass('ModifyNamePanel')
export class ModifyNamePanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "usercenter/prefabs/ModifyNamePanel";

    protected static className = "ModifyNamePanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_inputName: Node = null;

    father: UserCenterUI;

    createChildren() {
        super.createChildren();
    }
    init(param) {
        this.father = param;
    }

    async onNameEdit() {
        let str = this.AT_inputName.getComponent(EditBox).string;
        if (!str || str == "") {
            return DefaultToast.instance.showText("请输入昵称");
        }
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/user-information-update", { nick: str, head: GamePlayerManager.instance.player.simpleUser.headImg });
        if (resp.code != 200) {
            Global.UI.closeView(ModifyNamePanel);
            return DefaultToast.instance.showText(resp.msg);
        } else {
            GamePlayerManager.instance.player.simpleUser.nick = str;
            GamePlayerManager.instance.updatePlayerInfo(true);
            Global.UI.closeView(ModifyNamePanel);
            return DefaultToast.instance.showText('修改成功', resp.msg);
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(ModifyNamePanel);
    }
}