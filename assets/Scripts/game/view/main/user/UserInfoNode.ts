import { Label, Node, Sprite, _decorator } from "cc";
import { BaseEvent } from "../../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameUtils } from "../../../utils/GameUtils";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { BindPhonePanel } from "../BindPhonePanel";
import { ModifyNamePanel } from "./ModifyNamePanel";

const { ccclass, property } = _decorator;
@ccclass('UserInfoNode')
export class UserInfoNode extends ScrollToLeftInPanel {
    protected static prefabUrl = "usercenter/prefabs/UserInfoPanel";

    protected static className = "UserInfoNode";

    @PiterDirector.AUTO_BIND(Node)
    AT_PlayerHeader: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_nameLbel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_IdLbl: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_PhoneNum: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_freshBtn: Node;
    // @PiterDirector.AUTO_BIND(Node)
    // AT_kuisunBtn: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_changeHeadBtn: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_HeaderImage: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_DateNum: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_accountLbel: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_VersionLabel: Node;

    @PiterDirector.AUTO_BIND(Label)
    public AT_SafetyLabel: Label;
    public createChildren(): void {
        super.createChildren();
        this.initUI();
    }

    public onAdded(): void {
        super.onAdded();
        Global.EVENT.on(BaseEvent.USER_PHONE_UPDATE, this.updatePhone, this);
    }

    public onRemoved(): void {
        super.onRemoved();
        Global.EVENT.off(BaseEvent.USER_PHONE_UPDATE, this.updatePhone, this);
    }

    initUI() {
        this.AT_nameLbel.getComponent(Label).string = GamePlayerManager.instance.player.simpleUser.nick;
        this.AT_IdLbl.getComponent(Label).string = GamePlayerManager.instance.player.simpleUser.uid;
        if (GamePlayerManager.instance.player.phone) {
            ImageUtils.showImage(this.node.getChildByPath("contentNode/AT_BindPhoneBtn/common_xiala_btn").getComponent(Sprite), "altas/usercenter/usercenter_lock");
            this.node.getChildByPath("contentNode/AT_BindPhoneBtn/common_xiala_btn").angle = 0
        }
        this.AT_PhoneNum.getComponent(Label).string = GamePlayerManager.instance.player.phone ? GamePlayerManager.instance.player.phone : "未绑定";
        this.AT_changeHeadBtn.active = false;
        this.AT_accountLbel.getComponent(Label).string = GamePlayerManager.instance.player.loginName;
        this.AT_DateNum.getComponent(Label).string = GamePlayerManager.instance.player.regDate;
        this.AT_VersionLabel.getComponent(Label).string = Global.VERSION.CLIENT;
        ImageUtils.showRemoteHeader(this.AT_HeaderImage.getComponent(Sprite), GamePlayerManager.instance.player.simpleUser.headImg)

    }

    AT_BindPhoneBtnTouch() {
        if (GamePlayerManager.instance.player.phone) {
            return DefaultToast.instance.showText("已绑定手机");
        }
        Global.UI.openView(BindPhonePanel, { father: this })
    }


    AT_copyMycodeBtnTouch() {
        if (GamePlayerManager.instance.player.simpleUser.uid) {
            GameUtils.setClipBordStr(GamePlayerManager.instance.player.simpleUser.uid);
        }
    }

    freshName() {
        this.AT_nameLbel.getComponent(Label).string = GamePlayerManager.instance.player.simpleUser.nick;
    }

    onBtnModiFyName() {
        Global.UI.openView(ModifyNamePanel, this);
    }

    updatePhone(phone = null) {
        phone = GamePlayerManager.instance.player.phone;
        let head = phone.slice(0, 3);
        let tail = phone.slice(-4);
        this.AT_PhoneNum.getComponent(Label).string = head + " **** " + tail;
    }


    AT_BackBtnTouch() {
        Global.UI.closeView(UserInfoNode);
    }
}