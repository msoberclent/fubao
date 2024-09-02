import { Label, Node, Sprite, _decorator, isValid } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ServerConfig } from "../../../constant/ServerConst";
import { NoticePanel } from "../notice/NoticePanel";
import { RechargePanel } from "../recharge/RechargePanel";

const { ccclass, property } = _decorator;
@ccclass('ActivityCZHBPanel')
export class ActivityCZHBPanel extends PiterUI {
    @property(Node)
    layout: Node = null;

    createChildren() {
        super.createChildren();
        this.initUI();
    }

    async initUI() {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge-red-pack/mylist", {}, true)
        if (data.code == 200) {
            this.updateList(data)
        } else {
            return DefaultToast.instance.showText(data.msg);
        }
    }

    updateList(data) {
        if (!isValid(this.node)) return;
        for (let i = 0; i < data.data.length; i++) {
            let v = this.layout.children[i];
            if (!v) return;
            v[`info`] = data.data[i];
            if (data.data[i].receive) {
                ImageUtils.showImage(v.getChildByName("HBNode").getComponent(Sprite), "activity/hb/czshb_hb2");
                v.getChildByName("Node").active = true;
                v.getChildByName("Node").getComponent(Label).string = GoldUtils.formatGold(data.data[i].amount, 0) + "元";
                v.getChildByName("HBStatue").getComponent(Label).string = "已领取";
            } else {
                ImageUtils.showImage(v.getComponent(Sprite), "activity/hb/czshb_hb1");
                v.getChildByName("HBStatue").getComponent(Label).string = "未领取";
            }
        }
    }

    onBtnRechargeClick() {
        Global.UI.openView(RechargePanel);
        Global.UI.closeView(NoticePanel);
    }

    /**
     * 领红包
     * @param {*} e
     * @param {*} custom
     */
    async onHbClick(e, custom) {
        let node = e.target;
        if (!node[`info`]) return DefaultToast.instance.showText("暂时无法领取");
        let id = node[`info`].id;
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/recharge-red-pack/receive", { id: id });
        if (data.code == 200) {
            DefaultToast.instance.showText("领取成功", data.msg);
            this.updateList(data);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

}