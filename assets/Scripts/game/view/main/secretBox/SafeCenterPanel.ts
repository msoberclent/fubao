import { Label, Node, _decorator, tween } from "cc";

import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterView from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { BindPhonePanel } from "../BindPhonePanel";
import { SafeModifyXJMMPanel } from "./SafeModifyXJMMPanel";
import { SafeModifymmPanel } from "./SafeModifymmPanel";

const { ccclass, property } = _decorator;
@ccclass('SafeCenterPanel')
export class SafeCenterPanel extends PiterView {
    protected static prefabUrl = "prefabs/SafeCenterPanel";

    protected static className = "SafeCenterPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_freshGoldBtn: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_goldLbl: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_starLaout: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_curphone: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_modifyXJMMBtn: Node;

    allowmodifyPhone = true;

    public createChildren(): void {
        super.createChildren();
        this.AT_goldLbl.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
        this.updatePhone();
        this.updateXJMMStatus();
    }
    initUI(){}

    updatePhone(phone = null) {
        if (phone) {
        } else if (GamePlayerManager.instance.player.phone) {
            phone = GamePlayerManager.instance.player.phone;
        } else {
            return;
        }
        let head = phone.slice(0, 3);
        let tail = phone.slice(-4);
        this.AT_curphone.getComponent(Label).string = head + " **** " + tail;
        this.allowmodifyPhone = false;
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    AT_freshGoldBtnTouch() {
        tween(this.AT_freshGoldBtn).to(1.5, { angle: -360 }).call(() => {
            this.AT_goldLbl.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
            this, this.AT_freshGoldBtn.angle = 0;
        }).start();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(SafeCenterPanel);
    }

    AT_modifymmBtnclick() {
        Global.UI.openView(SafeModifymmPanel);
    }

    AT_modifyphoneclick() {
        if (!this.allowmodifyPhone) {
            DefaultToast.instance.showText("暂不能绑定手机");
            return
        };
        Global.UI.openView(BindPhonePanel, {
            father: this
        });
    }

    AT_modifyXJMMBtnTouch() {
        Global.UI.openView(SafeModifyXJMMPanel, {
            father: this
        });
    }


    updateXJMMStatus() {
        let hasMm = Global.PLAYER.player.payPwdSeted;
        this.AT_modifyXJMMBtn.getChildByName("onLabel").active = hasMm
        this.AT_modifyXJMMBtn.getChildByName("offLabel").active = !hasMm
    }

}