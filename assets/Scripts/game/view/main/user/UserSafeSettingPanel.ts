import { Label, Node, Sprite, _decorator } from "cc";
import { BaseEvent } from "../../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { BindPhonePanel } from "../BindPhonePanel";
import { BindRealNamePanel } from "../BindRealNamePanel";
import { FullScreenView } from "../FullScreenView";
import { SafeModifyXJMMPanel } from "../secretBox/SafeModifyXJMMPanel";
import { SafeModifymmPanel } from "../secretBox/SafeModifymmPanel";

const { ccclass, property } = _decorator;
@ccclass('UserSafeSettingPanel')
export class UserSafeSettingPanel extends FullScreenView {
    protected static prefabUrl = "usercenter/prefabs/UserSafeSettingPanel";

    protected static className = "UserSafeSettingPanel";
    @PiterDirector.AUTO_BIND(Node)
    AT_PhoneLabel: Node = null;
    @PiterDirector.AUTO_BIND(Node)
    AT_RealNameLabel: Node = null;

    public createChildren(): void {
        super.createChildren();
        this.initUI();
    }

    onAdded() {
        super.onAdded();
        Global.EVENT.on(BaseEvent.USER_PHONE_UPDATE, this.updatePhone, this);
    }

    onRemoved() {
        super.onRemoved();
        Global.EVENT.off(BaseEvent.USER_PHONE_UPDATE, this.updatePhone, this);
    }

    initUI() {
        if (GamePlayerManager.instance.player.phone) {
            this.updatePhone();
            this.node.getChildByPath("contentNode/common_tab_bg/AT_BindPhoneBtn/common_xiala_btn").angle = 0
            ImageUtils.showImage(this.node.getChildByPath("contentNode/common_tab_bg/AT_BindPhoneBtn/common_xiala_btn").getComponent(Sprite), "altas/usercenter/usercenter_lock")
        } else {
            this.AT_PhoneLabel.getComponent(Label).string = "绑定手机号码可以保护账号安全";
        }
        if (GamePlayerManager.instance.player.realName) {
            this.node.getChildByPath("contentNode/common_tab_bg/AT_BindTXNameBtn/common_xiala_btn").angle = 0
            ImageUtils.showImage(this.node.getChildByPath("contentNode/common_tab_bg/AT_BindTXNameBtn/common_xiala_btn").getComponent(Sprite), "altas/usercenter/usercenter_lock")
        }
        this.AT_RealNameLabel.getComponent(Label).string = GamePlayerManager.instance.player.realName ? GamePlayerManager.instance.player.realName : "未绑定";
    }

    AT_BindPhoneBtnTouch() {
        if (GamePlayerManager.instance.player.phone) {
            return DefaultToast.instance.showText("已绑定手机");
        }
        Global.UI.openView(BindPhonePanel, { father: this });
    }

    AT_BindTXNameBtnTouch() {
        if (GamePlayerManager.instance.player.realName) {
            return DefaultToast.instance.showText("已绑定提现姓名");
        }
        Global.UI.openView(BindRealNamePanel, { father: this })
    }

    AT_ModifyMMBtnTouch() {
        Global.UI.openView(SafeModifymmPanel);
    }

    AT_ModifyXJMMBtnTouch() {
        Global.UI.openView(SafeModifyXJMMPanel)
    }

    AT_BackBtnTouch() {
        Global.UI.closeView(UserSafeSettingPanel);
    }

    updatePhone(phone = null) {
        phone = GamePlayerManager.instance.player.phone;
        let head = phone.slice(0, 3);
        let tail = phone.slice(-4);
        this.AT_PhoneLabel.getComponent(Label).string = head + " **** " + tail;
    }


    updateRealName(name = null) {
        if (name) {
        } else if (GamePlayerManager.instance.player.realName) {
            name = GamePlayerManager.instance.player.realName;
        } else {
            return;
        }
        this.AT_RealNameLabel.getComponent(Label).string = GamePlayerManager.instance.player.realName;
    }
}