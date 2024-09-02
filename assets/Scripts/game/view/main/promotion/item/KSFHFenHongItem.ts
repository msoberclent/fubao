import { Color, Component, Label, Toggle, Widget, _decorator } from 'cc';
import { GoldUtils } from '../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
import { ButtonSpriteChange } from '../../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange';
import { ColorConst } from '../../../../constant/GameResConst';
import { PromotionKSFHNode } from '../sub/PromotionKSFHNode';
const { ccclass, property } = _decorator;

@ccclass('KSFHFenHongItem')
export class KSFHFenHongItem extends Component {

    itemData: any;

    indexz: number;
    father: PromotionKSFHNode = null;

    setItemData(itemData, i) {
        this.indexz = i;
        if (itemData.weekRecharge < 0) {
            itemData.weekRecharge = 0;
        }
        if (i % 2 == 0) {
            this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
        } else {
            this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
        }
        this.itemData = itemData;
        this.flushUI();
    }

    setRoot(father: PromotionKSFHNode) {
        this.father = father;
    }


    public flushUI() {
        let v = this.node;

        v.getChildByName("time").getComponent(Label).string = this.itemData.monthWeek || 0;

        v.getChildByPath("zfhNode/zfh").getComponent(Label).string = GoldUtils.formatGold(this.itemData.totalEffect || 0);

        v.getChildByPath("zqkNode/zqk").getComponent(Label).string = GoldUtils.formatGold(this.itemData.currentDebts || 0);

        v.getChildByPath("bqfhNode/bqfh").getComponent(Label).string = GoldUtils.formatGold(this.itemData.yujiEffect || 0);


        v.getChildByPath("klfhNode/klfh").getComponent(Label).string = GoldUtils.formatGold(this.itemData.effectJicha || 0);
        v.getChildByPath("klfhNode/klfh").getComponent(Label).color = this.itemData.effectJicha > 0 ? new Color().fromHEX(ColorConst.RED) : new Color().fromHEX(ColorConst.GREEN);

        v.getChildByPath("kcNode/kc").getComponent(Label).string = GoldUtils.formatGold(this.itemData.goldStockCurrent || 0);

        v.getChildByName("state").getComponent(Label).string = this.getShenheState(this.itemData.auditState || 0);
        v.getChildByName("state").getComponent(Label).color = this.getstateColor1(this.itemData.auditState);
    }

    getShenheState(num) {
        if (num == 0) {
            return "审核中";
        } else if (num == 1) {
            return "已审核"
        } else if (num == -1) {
            return "预估"
        } else {
            return "已拒绝";
        }
    }


    getstateColor1(num) {
        if (num == 0) {
            return new Color().fromHEX(ColorConst.NORMAL);
        } else if (num > 0) {
            return new Color().fromHEX(ColorConst.RED);
        } else {
            return new Color().fromHEX(ColorConst.GREEN);
        }
    }


    public onXiangqingBtnTouch() {
        if (this.indexz > 0) {
            this.father.openInfoUI(1, this.itemData.monthWeek);
            this.father.node.getChildByName("AT_Bottom").active = false;
        } else {
            this.father.openInfoUI(0);
            this.father.node.getChildByPath("AT_Bottom/AT_HYBtn").getComponent(Toggle).isChecked = true;
        }
        this.father.info.getChildByName("AT_zhishu1SC").getComponent(Widget).top = 0;
        this.father.info.getChildByPath("AT_zhishu1SC/view").getComponent(Widget).bottom = 0;
        this.father.info.getChildByName("page").active = false;
        this.father.info.getChildByPath("member").active = false;
    }
}





