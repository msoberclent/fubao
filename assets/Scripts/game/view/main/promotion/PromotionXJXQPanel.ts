import { Label, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { GameUtils } from "../../../utils/GameUtils";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { ModifyShuiShouPanel } from "./zhishu/ModifyShuiShouPanel";


const { ccclass, property } = _decorator;

@ccclass('PromotionXJXQPanel')
export class PromotionXJXQPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionXJXQPanel";

    protected static className = "PromotionXJXQPanel";

    itemData: any
    public createChildren(): void {
        super.createChildren();
        this.itemData = this.paramsData.info;
        this.showLabels();

    }


    public onAdded() {
        super.onAdded();
        Global.EVENT.on("FLUSH_PROMIOTION_BAODI", this.resquestMyZhishu, this);
    }


    public onRemoved() {
        super.onRemoved();
        Global.EVENT.off("FLUSH_PROMIOTION_BAODI", this.resquestMyZhishu, this);
    }

    resquestMyZhishu(data) {
        let node = this.node.getChildByPath(`contentNode/top/baodi/value`);
        this.paramsData.fanyongInfo.fanyongbi = data.value;
        node.getComponent(Label).string = data.value;
    }


    AT_closeBtnTouch(): void {
        Global.UI.closeView(PromotionXJXQPanel);
    }

    showLabels() {
        let labels = [
            { name: "uid", label: "uid/layout/value", desc: "id", divGold: false },
            { name: "memberInfo", label: "uid/layout/level/value", desc: "会员层级", divGold: false },
            { name: "registTime", label: "zcsj/value", desc: "注册时间", divGold: false },
            { name: "loginTime", label: "dlsj/value", desc: "登录时间", divGold: false },
            { name: "accountBalance", label: "zhye/value", desc: "账号余额", divGold: true },
            { name: "walletBalance", label: "qbye/value", desc: "钱包余额", divGold: true },
            { name: "selfRecharge", label: "ckje/value", desc: "充值", divGold: true },
            { name: "selfWithdraw", label: "tkje/value", desc: "充值", divGold: true },
            { name: "selfFlow", label: "yxtz/value", desc: "流水", divGold: true },

            { name: "directMemberCount", label: "zsrs/value", desc: "直属人数", divGold: false },
            { name: "teamMemberCount", label: "tdrs/value", desc: "团队人数", divGold: false },

            { name: "teamRecharge", label: "tdck/value", desc: "团队存款", divGold: true },
            { name: "teamWithdraw", label: "tdtk/value", desc: "团队提款", divGold: true },
            { name: "teamFlow", label: "tdyxtz/value", desc: "团队有效投注", divGold: true },
            { name: "recharge", label: "zck/value", desc: "总存款", divGold: true },
            { name: "withdraw", label: "ztk/value", desc: "总提款", divGold: true },
            { name: "flow", label: "zyxtz/value", desc: "总有效投注", divGold: true },
            { name: "fanyongbi", label: "baodi/value", desc: "当前保底", divGold: false },
        ]

        for (let i = 0; i < labels.length; i++) {
            let item = labels[i];
            let node = this.node.getChildByPath(`contentNode/top/` + item.label);
            if (node && item.name) {
                if (item.divGold) {
                    node.getComponent(Label).string = GoldUtils.formatGold(this.itemData[item.name] || 0);
                } else {
                    node.getComponent(Label).string = this.itemData[item.name]
                }
            }
        }
    }

    AT_fenhongBtnTouch() {
        Global.UI.openView(ModifyShuiShouPanel, this.paramsData.fanyongInfo);
    }

    AT_copyUidBtnTouch() {
        let node = this.node.getChildByPath(`contentNode/top/uid/layout/value`);
        if (node && node.getComponent(Label)) {
            GameUtils.setClipBordStr(node.getComponent(Label).string.trim());
        }
    }
}