import { ScrollView, Label, Color } from "cc";
import { EditBox, Node, _decorator, instantiate, v3 } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { ButtonSpriteChange } from "../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange";
import { ColorConst } from "../../../constant/GameResConst";

const { ccclass, property } = _decorator;

@ccclass('PromotionAwardRecordPanel')
export class PromotionAwardRecordPanel extends PiterPanel {
    protected static prefabUrl = "promotion/prefabs/PromotionAwardRecordPanel";

    protected static className = "PromotionAwardRecordPanel";

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
            v.getChildByName("sj").getComponent(Label).string = this.info[i].dayStr;
            v.getChildByName("ddh").getComponent(Label).string = this.info[i].id;
            v.getChildByName("tqje").getComponent(Label).string = GoldUtils.formatGold(this.info[i].effectExtract);
            v.getChildByName("zt").getComponent(Label).string = this.getState(this.info[i].auditState);
            v.getChildByName("zt").getComponent(Label).color = this.getstateColor(this.info[i].auditState);
            v.active = true;
            v.setPosition(v3(0, 0));
            if (i % 2 == 0) {
                v.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
            } else {
                v.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
            }
        }
    }

    getState(state) {
        if (state == 0) {
            return "待审核"
        } else if (state == 1) {
            return "通过"
        } else if (state == 2) {
            return "拒绝"
        } else {
            return "未知状态"
        }
    }

    getstateColor(num) {
        if (num == 0) {
            return new Color().fromHEX(ColorConst.NORMAL);
        } else if (num == 1) {
            return new Color().fromHEX(ColorConst.RED);
        } else {
            return new Color().fromHEX(ColorConst.GREEN);
        }
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(PromotionAwardRecordPanel);
    }

    async requestList() {

    }

    /**
     * 首页
     */
    AT_firstPageBtnTouch() {
        if (this.curPage == 1) return;
        this.curPage = 1;
        this.requestList();
    }

    /**
     * 尾页
     */
    AT_lastPageBtnTouch() {
        if (this.curPage == this.totalPage) return;
        this.curPage = this.totalPage;
        this.requestList();
    }

    /**
     * 上一页
     */
    AT_zhuanshuLastBtnTouch() {
        this.curPage -= 1;
        if (this.curPage < 1) {
            this.curPage += 1;
            return;
        }
        this.requestList();
    }

    /**
     * 下一页
     */
    AT_zhuanshuNextBtnTouch() {
        this.curPage += 1;
        if (this.curPage > this.totalPage) {
            this.curPage -= 1;
            return;
        }
        this.requestList();
    }

}