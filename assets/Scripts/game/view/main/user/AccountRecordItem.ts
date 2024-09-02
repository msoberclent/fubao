import { Color, Component, Label, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { ButtonSpriteChange } from "../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange";
import { ColorConst } from "../../../constant/GameResConst";
const { ccclass, property } = _decorator;

@ccclass('AccountRecordItem')
export class AccountRecordItem extends Component {


    public updateItem(itemData, index) {
        if (itemData.changeDesc == "平台扣款") {
            itemData.changeDesc = "提现2"
        }
        this.node.getChildByName("lx").getComponent(Label).string = this.getChangeType(itemData.changeType);
        this.node.getChildByName("jbbh").getComponent(Label).string = GoldUtils.formatGold(itemData.changeNum);
        this.node.getChildByName("jbbh").getComponent(Label).color = this.getJBcolor(itemData.changeNum);
        this.node.getChildByName("zhyeNode").getChildByName("zhye").getComponent(Label).string = GoldUtils.formatGold(itemData.curGold);
        // this.node.getChildByName("bz").getComponent(Label).string = itemData.changeDesc;
        if (this.node.getComponent(ButtonSpriteChange)) {
            if (index % 2 != 0) {
                this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
            } else {
                this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
            }
        }
        this.node.getChildByName("sj").getComponent(Label).string = itemData.createStamp;
    }

    getChangeType(type) {
        if (type == "106") {
            return "提现2"
        }
        if (type in JINSHU_ACC_TYPE) {
            return JINSHU_ACC_TYPE[type]
        } else {
            return "其他";
        }
    }

    getJBcolor(gold) {
        if (gold < 0) {
            return new Color().fromHEX(ColorConst.GREEN);
        } else {
            return new Color().fromHEX(ColorConst.RED);
        }
    }
}

export const JINSHU_ACC_TYPE = {
    "-1": "其他",
    "115": "在线充值",
    "107": "人工充值",
    "106": "平台扣款",
    "119": "游戏厂商上分",
    "1191": "游戏厂商下分",
    "2": "游戏结算",
    "112": "保险箱存款",
    "113": "保险箱提款",
    "116": "兑换订单扣款",
    "117": "兑换订单退款",
    "105": "平台赠送",
    "120": "活动赠送",
    "1201": "充值赠送",
    "1602": "金币划转转出",
    "1603": "金币划转转入",
    "101": "推广返佣",
    "1011": "整盘分红",
    "2000": "游戏厂商上分",
    "2001": "游戏厂商下分"
}