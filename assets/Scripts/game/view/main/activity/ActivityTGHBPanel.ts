import { _decorator } from "cc";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { RechargePanel } from "../recharge/RechargePanel";
import { ServerConfig } from "../../../constant/ServerConst";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { Node } from "cc";
import { Sprite } from "cc";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { Label } from "cc";
import ButtonUtils from "../../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { isValid } from "cc";

const { ccclass, property } = _decorator;
@ccclass('ActivityTGHBPanel')
export class ActivityTGHBPanel extends PiterPanel {
    protected static prefabUrl = "activity/prefabs/ActivityTGHBPanel";

    protected static className = "ActivityTGHBPanel";
    @property(Node)
    items: Node = null;

    createChildren() {
        super.createChildren();
        this.initUI();
    }

    async initUI() {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/promot-recharge-redpack/my-list", {}, true)
        if (data.code == 200) {
            this.updateList(data);
            this.node.getChildByName("contentNode").getChildByName("people").getComponent(Label).string = data.data.effectiveSub + "人";
        } else {
            return DefaultToast.instance.showText(data.msg);
        }
    }

    updateList(data) {
        let total = 0;
        if (!isValid(this.node)) return;
        for (let i = 0; i < data.data.config.length; i++) {
            let v = this.items.children[i];
            if (!v) return;
            v.getChildByName("m").getComponent(Label).string = GoldUtils.formatGold(data.data.config[i].reward, 0) + "元";
            total = data.data.config[i].reward;
            v.getChildByName("p").getComponent(Label).string = data.data.config[i].num + "人";
            if (data.data.list[0] && data.data.list[0].number == data.data.config[i].num) {
                v[`info`] = data.data.list[0];
                if (data.data.list[0] && data.data.list[0].receive) {
                    ButtonUtils.setGray(v.getComponent(Sprite), true);
                    v.getChildByName("g").active = true;
                }
                else {
                    ButtonUtils.setGray(v.getComponent(Sprite), false);
                    v.getChildByName("g").active = false;
                }
            } else {
                ButtonUtils.setGray(v.getComponent(Sprite), true);
            }
        }
        this.node.getChildByName("contentNode").getChildByName("total").getComponent(Label).string = GoldUtils.formatGold(total, 0);
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(ActivityTGHBPanel);
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
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/promot-recharge-redpack/receive", { id: id });
        if (data.code == 200) {
            DefaultToast.instance.showText("领取成功", data.msg);
            this.initUI();
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

}