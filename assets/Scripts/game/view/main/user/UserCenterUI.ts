import { Label, Node, RichText, Sprite, _decorator, sys, tween } from "cc";
import { BaseEvent } from "../../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { LocalStorageData } from "../../../../../Piter.Framework/BaseKit/Data/LocalStorageData";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterView, { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameUtils } from "../../../utils/GameUtils";
import { GameLoginView } from "../../login/GameLoginView";
import { MainHallSettingUI } from "../MainHallSettingUI";
import { InvitePanel } from "../invite/InvitePanel";
import { MainKeFuPanel } from "../kefu/MainKeFuPanel";
import { MailListPanel } from "../notice/MailListPanel";
import { PromotionCenterView } from "../promotion/PromotionCenterView";
import { RechargePanel } from "../recharge/RechargePanel";
import { SafeModifyXJMMPanel } from "../secretBox/SafeModifyXJMMPanel";
import { SafeModifymmPanel } from "../secretBox/SafeModifymmPanel";
import { SecretBoxPanel } from "../secretBox/SecretBoxPanel";
import { VIPPanel } from "../vip/VIPPanel";
import { WithdrawPanel } from "../withdraw/WithdrawPanel";
import { AccountRecordPanel } from "./AccountRecordPanel";
import { FindYuePanel } from "./FindYuePanel";
import { GameRecordPanel } from "./GameRecordPanel";
import { UserInfoNode } from "./UserInfoNode";
import { UserSafeSettingPanel } from "./UserSafeSettingPanel";

const { ccclass, property } = _decorator;
@ccclass('UserCenterUI')
export class UserCenterUI extends PiterView {
    protected static prefabUrl = "usercenter/prefabs/UserCenterUI";

    protected static className = "UserCenterUI";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.usercenter]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_PlayerHeader: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_nameLbel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_TimeLabel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_IdLbl: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_freshBtn: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_SafetyLabel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_HeaderImage: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_vipLevel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_XZBtn: Node;

    public createChildren(): void {
        super.createChildren();
        this.AT_XZBtn.active = sys.isBrowser;
        this.initUI();
    }

    AT_XZBtnTouch() {
        if (Global.PLAYER.appDownUrl) {
            GameUtils.goUrl(Global.PLAYER.appDownUrl);
        }
    }

    onAdded() {
        super.onAdded();
        Global.EVENT.on(BaseEvent.GOLD_FLUSH, this.flushGold, this)
    }

    onRemoved() {
        super.onRemoved();
        Global.EVENT.off(BaseEvent.GOLD_FLUSH, this.flushGold, this)
    }

    flushGold() {
        this.AT_GoldLabel.getComponent(Label).string = `¥ ` + GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
    }

    initUI() {
        this.AT_nameLbel.getComponent(Label).string = GamePlayerManager.instance.player.simpleUser.nick;
        this.AT_IdLbl.getComponent(Label).string = GamePlayerManager.instance.player.simpleUser.uid;
        this.AT_GoldLabel.getComponent(Label).string = `¥ ` + GoldUtils.formatGold(GamePlayerManager.instance.player.gold);
        // this.AT_SafetyLabel.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.safety);
        this.AT_vipLevel.getComponent(Label).string = "VIP" + GamePlayerManager.instance.player.vip;
        ImageUtils.showRemoteHeader(this.AT_HeaderImage.getComponent(Sprite), GamePlayerManager.instance.player.simpleUser.headImg)


        let date = Math.ceil((Date.now() - new Date(Global.PLAYER.player.regDate).getTime()) / (24 * 60 * 60 * 1000));
        this.AT_TimeLabel.getComponent(RichText).string = `<color=#a09f9d>已加入新澳国际</color><color=#ea4e3d>第${date}天</color>`
    }


    async AT_freshBtnTouch() {
        tween(this.AT_freshBtn).to(2, { angle: -360 }).call(() => {
            this.AT_freshBtn.angle = 0;
            DefaultToast.instance.showText("刷新成功");
        }).start();
        await GamePlayerManager.instance.updatePlayerInfo(true);
    }

    AT_CopyNameBtnTouch() {
        this.AT_copyMycodeBtnTouch();
        // GameUtils.setClipBordStr(GamePlayerManager.instance.player.simpleUser.nick);
    }

    AT_copyMycodeBtnTouch() {
        if (GamePlayerManager.instance.player.simpleUser.uid) {
            GameUtils.setClipBordStr(GamePlayerManager.instance.player.simpleUser.uid);
        }
    }

    AT_withdrawBtnTouch() {
        Global.UI.openView(WithdrawPanel);
    }

    AT_rechargeBtnTouch() {
        Global.UI.openView(RechargePanel);
    }

    AT_walletBtnTouch() {
        Global.UI.openView(SecretBoxPanel);
    }

    AT_accontBtnTouch() {
        Global.UI.openView(AccountRecordPanel);
        // Global.UI.openView(UserProfileUI, "3");
    }

    AT_gamerecordBtnTouch() {
        Global.UI.openView(GameRecordPanel);
        // Global.UI.openView(UserProfileUI, "2");
    }

    AT_xgMMBtnTouch() {
        Global.UI.openView(SafeModifymmPanel);
    }

    AT_xgxjMMBtnTouch() {
        Global.UI.openView(SafeModifyXJMMPanel);
    }

    AT_settingBtnTouch() {
        Global.UI.openView(MainHallSettingUI);
    }

    AT_AnquanBtnTouch() {
        Global.UI.openView(UserSafeSettingPanel);
    }

    AT_VipTeQaunBtnTouch() {
        Global.UI.openView(VIPPanel);
    }

    AT_TXZHBtnTouch() {
        Global.UI.openView(WithdrawPanel, {
            tabIndex: "3"
        });
    }

    AT_zhyeBtnTouch() {
        Global.UI.openView(FindYuePanel);
    }
    // AT_txglBtnTouch() {
    //     // Global.UI.openView(WithdrawRecordPanel);
    // }

    // AT_txjlBtnTouch() {
    //     // Global.UI.openView(WithdrawRecordPanel)
    // }

    AT_promotionBtnTouch() {
        Global.UI.openView(PromotionCenterView);
    }

    AT_userBtnTouch() {
        Global.UI.openView(UserInfoNode)
    }

    AT_cjwtBtnTouch() {
        Global.UI.openView(MainKeFuPanel);
    }

    AT_aqtcBtnTouch() {
        Global.PLAYER.clearPlayerData();
        LocalStorageData.removeItem("user_token");
        Global.SOCKET.isDingHao = true;
        Global.SOCKET.disConnect(false);
        Global.UI.closeAllView();
        Global.UI.openView(GameLoginView, { reload: false });
    }

    AT_kefuBtnTouch() {
        Global.UI.openView(MainKeFuPanel);
    }

    AT_messageBtnTouch() {
        Global.UI.openView(MailListPanel);
    }

    AT_userprofileBtnTouch() {
        Global.UI.openView(UserInfoNode);
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(UserCenterUI);
    }

    AT_InviteBtnTouch() {
        Global.UI.openView(InvitePanel);
    }
}