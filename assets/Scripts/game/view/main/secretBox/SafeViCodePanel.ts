import { EditBox, Label, Node, Sprite, _decorator, macro, tween } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterView from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { SafeModifymmPanel } from "./SafeModifymmPanel";

const { ccclass, property } = _decorator;
@ccclass('SafeViCodePanel')
export class SafeViCodePanel extends PiterView {
    protected static prefabUrl = "prefabs/SafeViCodePanel";

    protected static className = "SafeViCodePanel";
    @PiterDirector.AUTO_BIND(EditBox)
    AT_input1: EditBox;
    @PiterDirector.AUTO_BIND(Node)
    AT_inputphone: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_regetBtn: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_freshGoldBtn: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_goldLbl: Node;
    @PiterDirector.AUTO_BIND(Sprite)
    AT_getCodeBtn: Sprite;
    @PiterDirector.AUTO_BIND(Node)
    AT_Content: Node;
    

    phoneNum = "";
    schuduleTime = 1;

    public createChildren(): void {
        super.createChildren();
        this.AT_goldLbl.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
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

    onPhoneInput(e, custom) {
        if (custom && custom !== "delete") {
            this.phoneNum += custom;
        } else if (custom == "delete") {
            if (this.phoneNum.length >= 1) {
                this.phoneNum = this.phoneNum.substring(0, this.phoneNum.length - 1)
            }
        }
        if (this.phoneNum == "") {
            this.AT_inputphone.getChildByName("PLACEHOLDER_LABEL").active = true;
        } else {
            this.AT_inputphone.getChildByName("PLACEHOLDER_LABEL").active = false;
        }
        this.AT_inputphone.getChildByName("TEXT_LABEL").getComponent(Label).string = this.phoneNum;
    }

    async AT_getCodeBtnTouch() {
        if (this.phoneNum == "" || this.phoneNum.length != 11) {
            DefaultToast.instance.showText("手机号不正确!");
            return;
        }
        let strPhone = this.AT_Content.getChildByName("phoneNum");
        let head = this.phoneNum.slice(0, 3);
        let tail = this.phoneNum.slice(-4);
        strPhone.getComponent(Label).string = head + " **** " + tail;
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/tool/send-code", { phone: this.phoneNum });
        if (data.code == 200) {
            DefaultToast.instance.showText("发送成功", data.msg);
            this.startSchudule();
            ButtonUtils.setGray(this.AT_getCodeBtn, true)
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    startSchudule() {
        this.schuduleTime = 60;
        this.AT_regetBtn.getComponent(Label).string = "重新获取" + this.schuduleTime + "s";
        this.schedule(this._countDown, 1, macro.REPEAT_FOREVER);
    }

    _countDown() {
        if (this.schuduleTime < 0) return;
        this.schuduleTime -= 1;
        if (this.schuduleTime <= 0) {
            this.unschedule(this._countDown);
            this.AT_regetBtn.getComponent(Label).string = "重新获取";
            ButtonUtils.setGray(this.AT_getCodeBtn, false)
        }
        this.AT_regetBtn.getComponent(Label).string = "重新获取" + this.schuduleTime + "s";
    }

    async onVicodeEditEnd() {
        let vicode = this.AT_input1.string;
        if (vicode != "") {
            let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/bind-phone", { phone: this.phoneNum, code: vicode });
            if (data.code == 200) {
                Global.UI.openView(SafeModifymmPanel, { openType: 1 });
                Global.UI.closeView(SafeViCodePanel);
            } else {
                DefaultToast.instance.showText(data.msg);
            }
        }
    }

    AT_regetBtnTouch() {
        if (this.schuduleTime > 0) return;
        this.AT_getCodeBtnTouch();
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(SafeViCodePanel);
    }

}