import { Node, _decorator } from "cc";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";

const { ccclass, property } = _decorator;
@ccclass('ActivityBwhbyPanel')
export class ActivityBwhbyPanel extends PiterPanel {
    protected static prefabUrl = "prefabs/activity/ActivityBwhbyPanel";

    protected static className = "ActivityBwhbyPanel";
    @property(Node)
    kaiwan: Node = null;
    @property(Node)
    daikai: Node = null;

    hbid: string;

    createChildren() {
        super.createChildren();
        // Global.SOUND.playEffect("back/sound/bwhb_bg_53964288", false);
    }

    init(paramsData: any): void {
        this.hbid = paramsData.id;
    }

    /**
     * 领红包
     * @param {*} e
     * @param {*} custom
     */
    async AT_qiangBtnTouch(e, custom) {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/connect/rob-bonus", { id: this.hbid }, true);
        if (data.code == 200) {
            DefaultToast.instance.showText("领取成功", data.msg);
            this.daikai.active = false;
            this.kaiwan.active = true;
            // this.kaiwan.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
            // this.kaiwan.getComponent(sp.Skeleton).setCompleteListener(() => {
            //     this.kaiwan.getComponent(sp.Skeleton).setCompleteListener(null);
            //     if (data.data.bonusCountLeft <= 0 || data.data.robMoney == 0) {
            //         this.kaiwan.getChildByName("noMoney").active = true;
            //     } else {
            //         this.kaiwan.getChildByName("money").getComponent(Label).string = GoldUtils.formatGold(data.data.robMoney) + "元";
            //         this.kaiwan.getChildByName("money").active = true;
            //     }
            // })
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(ActivityBwhbyPanel);
    }

}