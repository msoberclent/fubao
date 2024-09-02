import { Label, Node, Sprite, _decorator } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { BankCardUtils } from "../../../../../Piter.Framework/UIKit/Util/BankCardUitls";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { WithdrawMethodItem } from "../../../message/GameMessage";
import { GameEvent } from "../../../model/event/GameEvent";
import { BankAddPanel } from "./BankAddPanel";
const { ccclass, property } = _decorator;
@ccclass('BankListPanel')
export class BankListPanel extends PiterPanel {
    protected static prefabUrl = "bank/prefabs/BankListPanel";

    protected static className = "BankListPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_Icons: Node;

    cardData: WithdrawMethodItem[] = [];

    @PiterDirector.AUTO_BIND(Node)
    AT_AddBtn: Node;

    public createChildren(): void {
        super.createChildren();
        this.onShowUI();
    }

    onShowUI() {
        this.cardData = GamePlayerManager.instance.getMineWithdrawMethodByType(0)
        for (let i = 0; i < 3; i++) {
            let cardNode = this.AT_Icons.getChildByName(`AT_Icon${i + 1}`);
            let cardData = this.cardData[i];
            if (cardData) {
                cardNode.active = true;
                this.showCardNodeInfo(cardNode, this.cardData[i]);
            } else {
                cardNode.active = false;
            }
        }
        this.AT_AddBtn.active = this.cardData.length < 3;
    }

    showCardNodeInfo(cardNode: Node, cardData: WithdrawMethodItem) {
        let bg = cardNode.getChildByName("bg").getComponent(Sprite);
        let name = cardNode.getChildByName("name").getComponent(Label);
        let value = cardNode.getChildByName("value").getComponent(Label);
        let defalut = cardNode.getChildByName("defalut");
        defalut.active = cardData.isdefault == 1;
        if (cardData.provider) {
            if (Global.RES.checkHasRES(`bank/res/icon/bank_bg_${cardData.provider}`)) {
                ImageUtils.showImage(bg, `bank/res/icon/bank_bg_${cardData.provider}`)
            } else {
                ImageUtils.showImage(bg, `bank/res/icon/bank_bg_DEFAULT`)
            }
        } else {
            ImageUtils.showImage(bg, `bank/res/icon/bank_bg_DEFAULT`)
        }
        if (cardData.notes) {
            name.string = JSON.parse(cardData.notes).bankName;
        } else {
            name.string = "未知"
        }
        if (cardData.accountAddr) {
            value.string = BankCardUtils.jiamiCard(cardData.accountAddr);
        } else {
            value.string = "未知"
        }
    }

    public onAdded(): void {
        super.onAdded();
        Global.EVENT.on(GameEvent.WITH_METHOD_UPDATE, this.onShowUI, this)
    }

    public onRemoved(): void {
        super.onRemoved();
        Global.EVENT.off(GameEvent.WITH_METHOD_UPDATE, this.onShowUI, this)
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(BankListPanel);
    }

    AT_AddBtnTouch() {
        Global.UI.openView(BankAddPanel);
    }

    iconTouch(e, index) {
        let cardData = this.cardData[index];
        Global.EVENT.dispatchEvent(GameEvent.BANK_ITEM_SELECT, cardData);
        this.AT_closeBtnTouch();
    }
}