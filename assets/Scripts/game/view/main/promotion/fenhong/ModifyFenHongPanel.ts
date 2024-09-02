import { EditBox, Label, Node, _decorator } from "cc";
import { PiterDirector } from "../../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { DefaultToast } from "../../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../../constant/ServerConst";
import { GamePlayerManager } from "../../../../manager/GamePlayerManager";
import { GoldUtils } from './../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';


const { ccclass, property } = _decorator;

@ccclass('ModifyFenHongPanel')
export class ModifyFenHongPanel extends PiterPanel {
    protected static prefabUrl = "promotion/prefabs/fenhong/ModifyFenHongPanel";

    protected static className = "ModifyFenHongPanel";
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
        this.dailiModel = Global.PLAYER.clientConfig['PROXY_BONUS_CLIENT_SWITCH'] == "0" ? 2 : 1;
        this.initUI();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    init(paramsData: any): void {
        this.from = paramsData.from;
        this.data = paramsData;
    }

    dailiModel: number = 0;
    initUI() {
        this.AT_daiId.getComponent(Label).string = this.data.fatherid;
        this.AT_dainick.getComponent(Label).string = this.data.id;
        this.AT_input3.string = GoldUtils.toServerGold(this.data.hisfanyong) + "";
        this.AT_myjicha.getComponent(Label).string = GoldUtils.toServerGold(this.data.fanyongbiVal) + "";
        this.platFanyongbi = this.data.fanyongbi;
        this.node.getChildByPath("contentNode/content2").active = true;
    }

    async AT_comfirmBtnTouch() {
        if (this.dailiModel == 2) {
            Global.UI.closeView(ModifyFenHongPanel);
            return;
        }
        let msg;
        let cnt = Number(this.AT_input3.string);
        // if (!cnt || Number(cnt) > this.data.fanyongbiVal) return;
        let data = { childId: this.data.fatherid, uid: GamePlayerManager.instance.player.simpleUser.id, percent: Number(cnt) };
        msg = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/proxy-set-kuishun-fanyong", data);
        if (msg.code == 200) {
            DefaultToast.instance.showText("修改成功");
            Global.EVENT.dispatchEvent("FLUSH_KUISUN_BAODI");
            Global.UI.closeView(ModifyFenHongPanel);
        } else {
            DefaultToast.instance.showText(msg.msg);
        }
    }

    AT_closeBtnTouch(): void {
        Global.UI.closeView(ModifyFenHongPanel);
    }

}