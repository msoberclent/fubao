

import { EditBox, Label, Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../../constant/ServerConst";
import { GamePlayerManager } from "../../../../manager/GamePlayerManager";


const { ccclass, property } = _decorator;

@ccclass('ModifyShuiShouPanel')
export class ModifyShuiShouPanel extends PiterPanel {
    protected static prefabUrl = "promotion/prefabs/zhishu/ModifyShuiShouPanel";

    protected static className = "ModifyShuiShouPanel";
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input3: EditBox;
    @PiterDirector.AUTO_BIND(Node)
    AT_myjicha: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_dainick: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_daiId: Node;

    from = "promotion";
    data = null;
    platFanyongbi = 0;

    public createChildren(): void {
        super.createChildren();
        this.dailiModel = Global.PLAYER.clientConfig['CLIENT_DISPLAY_MODE'] == "0" ? 2 : 1;
        this.initUI();
    }

    init(paramsData: any): void {
        this.from = paramsData.from;
        this.data = paramsData;
    }

    dailiModel: number = 0;
    initUI() {
        this.AT_daiId.getComponent(Label).string = this.data.fatherid;
        this.AT_dainick.getComponent(Label).string = this.data.id;
        this.AT_input3.string = this.data.hisfanyong + "";
        this.AT_myjicha.getComponent(Label).string = this.data.fanyongbiVal;
        this.platFanyongbi = this.data.fanyongbi;
        if (this.dailiModel == 2) {
            this.node.getChildByPath("contentNode/content2").active = true;
        } else {
            //有种模式 不可修改值
            // this.AT_input3.getComponent(EditBox).enabled = false;
            // this.AT_input3.string = this.data.fanyongbiVal + "";
            this.node.getChildByPath("contentNode/content2").active = true;
        }
    }

    async AT_comfirmBtnTouch() {
        let msg;
        let cnt = Number(this.AT_input3.string);
        if (!cnt || cnt > this.data.fanyongbiVal) return DefaultToast.instance.showText("保底值不能高于自身");
        let data = { childId: this.data.fatherid, uid: GamePlayerManager.instance.player.simpleUser.uid, bonus: cnt };
        msg = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/proxy-set-lv", data);
        if (msg.code == 200) {
            DefaultToast.instance.showText("修改成功", msg.msg);
            this.AT_input3.string = cnt + "";
            Global.EVENT.dispatchEvent("FLUSH_PROMIOTION_BAODI", { value: cnt });
            Global.UI.closeView(ModifyShuiShouPanel);
        } else {
            DefaultToast.instance.showText(msg.msg);
        }
    }

    AT_closeBtnTouch(): void {
        Global.UI.closeView(ModifyShuiShouPanel);
    }

}