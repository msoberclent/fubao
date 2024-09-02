import { Label, _decorator } from "cc";
import { GoldUtils } from "../../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../../Piter.Framework/PiterGlobal";
import { GamePlayerManager } from "../../../../manager/GamePlayerManager";
import { ScrollToLeftInPanel } from "../../../panel/ScrollToLeftInPanel";


const { ccclass, property } = _decorator;

@ccclass('FenHongInfoPanel')
export class FenHongInfoPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "promotion/prefabs/fenhong/FenHongInfoPanel";

    protected static className = "FenHongInfoPanel";

    itemData: any
    public createChildren(): void {
        super.createChildren();
        this.itemData = this.paramsData.info;
        if (this.paramsData.type == 1) {
            this.showLabels();
        } else {
            this.showLabels2();
        }

    }

    AT_closeBtnTouch(): void {
        Global.UI.closeView(FenHongInfoPanel);
    }

    showLabels2() {
        let labels = [
            { name: "weekRecharge", label: "contentNode/content2/tdcz", desc: "团队充值", formartGold: true },
            { name: "weekWithdraw", label: "contentNode/content2/tdtx", desc: "团队提现", formartGold: true },

            { name: "chongTiCha", label: "contentNode/content2/tdctc", desc: "团队重提差", formartGold: true },
            { name: "goldStock", label: "contentNode/content2/tdkc", desc: "团队库存", formartGold: true },

            { name: "contributeFenhong", label: "contentNode/content2/tdgx", desc: "团队分红", formartGold: true },

            { name: "weekOneRecharge", label: "contentNode/content2/grcz", desc: "", formartGold: true },
            { name: "weekOneWithdraw", label: "contentNode/content2/grtx", desc: "", formartGold: true },
            { name: "chongTiChaOne", label: "contentNode/content2/grctc", desc: "", formartGold: true },

            { name: "goldStockOne", label: "contentNode/content2/grkc", desc: "", formartGold: true },

            { name: "cfenhongOne", label: "contentNode/content1/grgx", desc: "", formartGold: true },

            { name: "rechargeSelf", label: "contentNode/content1/dlcz", desc: "", formartGold: true },
            { name: "withdrawSelf", label: "contentNode/content1/dltx", desc: "", formartGold: true },

            { name: "baesFanyong", label: "contentNode/content1/fhbl", desc: "", formartGold: false },

            { name: "stockCurrentSelf", label: "contentNode/content1/dlkc", desc: "", formartGold: true },
            { name: "chongTiChaSelf", label: "contentNode/content1/dlctc", desc: "", formartGold: true },
            { name: "uid", label: "contentNode/content1/dlid", desc: "", formartGold: true },
        ]
        for (let i = 0; i < labels.length; i++) {
            let item = labels[i];
            let node = this.node.getChildByPath(item.label);
            if (node && item.name) {
                node.getComponent(Label).string = GoldUtils.formatGold(this.itemData[item.name] || 0);
            }
        }

    }

    showLabels() {
        let labels = [
            { name: "weekRecharge", label: "contentNode/content2/tdcz", desc: "团队充值", formartGold: true },
            { name: "weekWithdraw", label: "contentNode/content2/tdtx", desc: "团队提现", formartGold: true },

            { name: "chongTiCha", label: "contentNode/content2/tdctc", desc: "团队重提差", formartGold: true },
            { name: "goldStock", label: "contentNode/content2/tdkc", desc: "团队库存", formartGold: true },

            { name: "contributeFenhong", label: "contentNode/content2/tdgx", desc: "团队分红", formartGold: true },

            { name: "weekOneRecharge", label: "contentNode/content2/grcz", desc: "", formartGold: true },
            { name: "weekOneWithdraw", label: "contentNode/content2/grtx", desc: "", formartGold: true },
            { name: "chongTiChaOne", label: "contentNode/content2/grctc", desc: "", formartGold: true },

            { name: "goldStockOne", label: "contentNode/content2/grkc", desc: "", formartGold: true },

            { name: "cfenhongOne", label: "contentNode/content2/grgx", desc: "", formartGold: true },

            { name: "rechargeSelf", label: "contentNode/content1/dlcz", desc: "", formartGold: true },
            { name: "withdrawSelf", label: "contentNode/content1/dltx", desc: "", formartGold: true },
            { name: "baesFanyong", label: "contentNode/content1/fhbl", desc: "", formartGold: false },
            { name: "stockCurrentSelf", label: "contentNode/content1/dlkc", desc: "", formartGold: true },
            { name: "chongTiChaSelf", label: "contentNode/content1/dlctc", desc: "", formartGold: true },

            { name: "uid", label: "contentNode/content1/dlid", desc: "" },
        ]
        for (let i = 0; i < labels.length; i++) {
            let item = labels[i];
            let node = this.node.getChildByPath(item.label);
            if (node && item.name) {
                if (item.formartGold) {
                    node.getComponent(Label).string = GoldUtils.formatGold(this.itemData[item.name] || 0);
                } else {
                    node.getComponent(Label).string = this.itemData[item.name];
                }
            }
        }


    }
}