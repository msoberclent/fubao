import { Color, Component, Label, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { ButtonSpriteChange } from "../../../../../Piter.Framework/UIKit/Component/ButtonSpriteChange";
import { ColorConst } from "../../../constant/GameResConst";

const { ccclass, property } = _decorator;

@ccclass('GameRecordItem')
export class GameRecordItem extends Component {

    public updateItem(itemData, index) {
        this.node.getChildByName("dhNode").getChildByName("dh").getComponent(Label).string = itemData.betOrderNo// Utils.getShortName(itemData.betOrderNo, 8, true);
        this.node.getChildByName("name").getComponent(Label).string = itemData.gameName;
        this.node.getChildByName("jeNode").getChildByName("je").getComponent(Label).string = GoldUtils.formatGold(itemData.betAmount);
        this.node.getChildByName("syNode").getChildByName("sy").getComponent(Label).string = GoldUtils.formatGold(itemData.netPnl);
        this.showStatusLabel(itemData.netPnl);
        let str = ""
        if (!itemData.settleTime || itemData.settleTime == "") {
            str = "未结算"
        } else {
            str = "已结算"
        }
        this.node.getChildByName("zt").getComponent(Label).string = str;
        this.node.getChildByName("sj").getComponent(Label).string = itemData.settleTime;
        if (this.node.getComponent(ButtonSpriteChange)) {
            if (index % 2 != 0) {
                this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(1);
            } else {
                this.node.getComponent(ButtonSpriteChange).changeSpriteFrame(0);
            }
        }
    }

    public showStatusLabel(value) {
        let label = this.node.getChildByName("syNode").getChildByName("sy").getComponent(Label)
        if (value > 0) {
            label.color = new Color().fromHEX(ColorConst.PURPLE)
        } else {
            label.color = new Color().fromHEX(ColorConst.GREEN)
        }
    }
}