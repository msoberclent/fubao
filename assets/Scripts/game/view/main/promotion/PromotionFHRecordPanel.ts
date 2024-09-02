import { ScrollView, Label } from "cc";
import { EditBox, Node, _decorator, instantiate, v3 } from "cc";
import { tween } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { Utils } from "../../../../../Piter.Framework/BaseKit/Util/Utils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";

const { ccclass, property } = _decorator;

@ccclass('PromotionFHRecordPanel')
export class PromotionFHRecordPanel extends PiterPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionFHRecordPanel";

    protected static className = "PromotionFHRecordPanel";

    @property(Node)
    sc: Node = null;
    @property(Node)
    scItem: Node = null;

    info = null;
    totalPage = 1;
    curPage = 1;

    public createChildren(): void {
        super.createChildren();
        this.initList();
    }

    init(param) {
        this.info = param;
    }

    public onAdded(): void {
        super.onAdded();
    }

    initList() {
        if (!this.info || this.info.length == 0) {
            this.node.getChildByName("contentNode").getChildByName("cm_nodata").active = true;
            return;
        }
        this.node.getChildByName("contentNode").getChildByName("cm_nodata").active = false;
        this.sc.getComponent(ScrollView).content.children.forEach((v) => {
            v.active = false
        })
        for (let i = 0; i < this.info.length; i++) {
            let v = this.sc.getComponent(ScrollView).content.children[i];
            if (!v) {
                v = instantiate(this.scItem);
                v.setParent(this.sc.getComponent(ScrollView).content);
            }
            v.getChildByName("qh").getComponent(Label).string = Utils.getShortName(this.info[i].sn, 13);
            v.getChildByName("grgf").getComponent(Label).string = this.info[i].myStock;
            v.getChildByName("mgfh").getComponent(Label).string = GoldUtils.formatGold(this.info[i].perStockValue);
            v.getChildByName("grfh").getComponent(Label).string = GoldUtils.formatGold(this.info[i].myStockEffect);
            v.getChildByName("sj").getComponent(Label).string = this.info[i].logTime;
            v.active = true;
            v.setPosition(v3(0, 0));
        }
    }



    public onRemoved(): void {
        super.onRemoved();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionFHRecordPanel);
    }

}