import { Color, Label, Node, ScrollView, _decorator, instantiate, v3 } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ColorConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { FenHongInfoPanel } from "./fenhong/FenHongInfoPanel";

const { ccclass, property } = _decorator;

@ccclass('PromotionKuisunProfitPanel')
export class PromotionKuisunProfitPanel extends PiterPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionKuisunProfitPanel";

    protected static className = "PromotionKuisunProfitPanel";
    index = null;

    @property(Node)
    sc: Node = null;
    @property(Node)
    scItem: Node = null;
    totalrecharge = 0;
    totalStore = 0;
    totalKucun = 0;
    totalWithdraw = 0;

    init(param) {
        this.index = param.index;
    }

    createChildren() {
        super.createChildren();
        this.scItem.active = false;
        this.initList();
    }

    async initList() {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/kuishun-my-reward-detail", { id: this.index, page: 1, pageLength: 50 });
        if (data.code == 200) {
            let list = data.data;
            this.sc.getComponent(ScrollView).content.destroyAllChildren();
            if (list.length <= 0) {
                this.node.getChildByName("contentNode").getChildByName("cm_nodata").active = true;
            } else {
                this.node.getChildByName("contentNode").getChildByName("cm_nodata").active = false;
            }
            for (let i = 0; i < list.length; i++) {
                let v = instantiate(this.scItem);
                v['listInfo'] = list[i];
                v.getChildByName("dlid").getComponent(Label).string = list[i].uid;
                v.getChildByName("dlnc").getComponent(Label).string = list[i].nick;
                v.getChildByName("cz").getComponent(Label).string = GoldUtils.formatGold(list[i].recharge);
                v.getChildByName("tx").getComponent(Label).string = GoldUtils.formatGold(list[i].withdrwal);
                v.getChildByName("ctc").getComponent(Label).string = GoldUtils.formatGold(list[i].chongticha);
                this.totalrecharge += list[i].recharge;
                this.totalKucun += list[i].stock;
                this.totalWithdraw += list[i].withdrwal;
                this.totalStore += list[i].contribute;
                v.getChildByName("ctc").getComponent(Label).color = list[i].chongticha > 0 ? new Color().fromHEX(ColorConst.RED) : new Color().fromHEX(ColorConst.GREEN);
                v.getChildByName("kc").getComponent(Label).string = GoldUtils.formatGold(list[i].stock);
                v.getChildByName("fhb").getComponent(Label).string = list[i].childRate + "/" + list[i].bicha;
                v.getChildByName("xjgx").getComponent(Label).string = GoldUtils.formatGold(list[i].contribute);
                v.getChildByName("xjgx").getComponent(Label).color = list[i].contribute > 0 ? new Color().fromHEX(ColorConst.RED) : new Color().fromHEX(ColorConst.GREEN);
                v.setPosition(v3(0, 0));
                v.active = true;
                v.setParent(this.sc.getComponent(ScrollView).content);
            }
            this.node.getChildByName("contentNode").getChildByName("totalrecharge").getComponent(Label).string = "总充值:" + GoldUtils.formatGold(this.totalrecharge || 0);
            this.node.getChildByName("contentNode").getChildByName("totalwithdraw").getComponent(Label).string = "总提现:" + GoldUtils.formatGold(this.totalWithdraw || 0);
            this.node.getChildByName("contentNode").getChildByName("totalkucun").getComponent(Label).string = "总库存:" + GoldUtils.formatGold(this.totalKucun || 0);
            this.node.getChildByName("contentNode").getChildByName("totalgx").getComponent(Label).string = "总贡献:" + GoldUtils.formatGold(this.totalStore || 0);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionKuisunProfitPanel);
    }

    public xqBtnTouch(e) {
        let node = e.target.parent;
        if (node && node[`listInfo`]) {
            Global.UI.openView(FenHongInfoPanel, { type: 2, info: node[`listInfo`] });
        }
    }
}