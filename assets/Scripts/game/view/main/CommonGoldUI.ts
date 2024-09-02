import { Label, Node, _decorator, tween } from "cc";
import { BaseEvent } from "../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { GoldUtils } from "../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultToast } from "../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { GamePlayerManager } from "../../manager/GamePlayerManager";
import { RechargePanel } from "./recharge/RechargePanel";

const { ccclass, property } = _decorator;

@ccclass('CommonGoldUI')
export class CommonGoldUI extends PiterUI {
    @property(Node)
    AT_freshBtn: Node = null;

    @property(Node)
    AT_goldLbl: Node = null;

    @property(Node)
    jiaBtn: Node = null;

    onLoad(): void {
        Global.EVENT.on(BaseEvent.GOLD_FLUSH, this.flushGold, this)
    }

    public onDestroy(): void {
        Global.EVENT.off(BaseEvent.GOLD_FLUSH, this.flushGold, this)
    }

    start(): void {
        this.AT_goldLbl.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
    }

    flushGold(data) {
        if (this.AT_goldLbl) {
            this.AT_goldLbl.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold)
        }
    }

    async onBtnFreshClick() {
        tween(this.AT_freshBtn).to(2, { angle: -360 }).call(() => {
            this.AT_freshBtn.angle = 0;
            DefaultToast.instance.showText("刷新成功");
        }).start();
        await GamePlayerManager.instance.updatePlayerInfo(true);
    }

    onBtnAddClick() {
        // RESLoading.instance.loadGroup([BundlesInfo.main_recharge], () => {
            Global.UI.openView(RechargePanel);
        // });
    }

}