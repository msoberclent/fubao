import { Label, Node, RichText, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { Utils } from "../../../../../Piter.Framework/BaseKit/Util/Utils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import List from "../../../../../Piter.Framework/UIKit/Component/list/List";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { GameUtils } from "../../../utils/GameUtils";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { InviteCodePanel } from "../InviteCodePanel";
import { NoticePanel } from "../notice/NoticePanel";
import { PromotionSharePanel } from "../promotion/share/PromotionSharePanel";
import { RechargePanel } from "../recharge/RechargePanel";
import { ActivityTGLJHBItem } from "./ActivityTGLJHBItem";
import { ActivityTGLJRecord } from "./ActivityTGLJRecord";

const { ccclass, property } = _decorator;
@ccclass('ActivityTGLJPanel')
export class ActivityTGLJPanel extends ScrollToLeftInPanel {

    protected static prefabUrl = "activity/prefabs/ActivityTGLJPanel";

    protected static className = "ActivityTGLJPanel";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.activity]
    }
    
    @PiterDirector.AUTO_BIND(Node)
    AT_hbItem: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_layout: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_QRCode: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_InviteCode: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_tiaojian1: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_tiaojian2: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_tiaojian3: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_linkurl: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_EffectXJLable: Node = null;

    totalHbLen = 5000;
    curHbIdx = null; //已领取红包
    curCanLQIdx = null; //可领取红包数，有效下级
    packageNum = null; //红包金额
    qrurl = "";

    createChildren() {
        super.createChildren();
        this.initUI();
    }

    async initUI() {
        let code = Global.PLAYER.player.qrCodeUrl;
        if (code && code != "") {
            this.AT_linkurl.getComponent(Label).string = code//Utils.getShortName(respData.qrCodeUrl, 22);
            this.qrurl = code;
            Utils.QRCreate(this.AT_QRCode, code);
        }

        let invite = Global.PLAYER.player.inviteCode
        if (invite && invite != "") {
            this.AT_InviteCode.getComponent(Label).string = invite//Utils.getShortName(respData.qrCodeUrl, 22);
        }

        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/promot-recharge-redpack/my-redpack-info", {})
        if (data.code == 200) {
            this.curCanLQIdx = data.data.effectiveSub;
            this.curHbIdx = data.data.currGiveNum;
            this.packageNum = data.data.redPack;
            this.updateList(data);
        } else {
            return DefaultToast.instance.showText(data.msg);
        }
    }

    updateList(data) {
        this.AT_tiaojian1.getComponent(Label).string = GoldUtils.formatGold(data.data.addUpRecharge) + "或以上";
        this.AT_tiaojian2.getComponent(Label).string = GoldUtils.formatGold(data.data.addUpFlow) + "或以上";
        this.AT_tiaojian3.getComponent(Label).string = data.data.addUpTimes + "天或以上";
        this.AT_EffectXJLable.getComponent(RichText).string = `<color=#746a61>有效下级</color><color=#ea4e3d>${this.curCanLQIdx}</color><color=#746a61>人</color>`
        this.node.getChildByPath("contentNode/sc").getComponent(List).numItems = 5000;
        if (this.curHbIdx > 8) {
            this.scheduleOnce(() => {
                this.node.getChildByPath("contentNode/sc").getComponent(List).scrollTo(this.curHbIdx - 1, .5)
            }, 1)
        }
    }

    onListRender(item: Node, idx) {
        let data = null;
        item.active = true;
        item.getComponent(ActivityTGLJHBItem).setRoot(this);
        item.getComponent(ActivityTGLJHBItem).updateItem(data, idx);
    }

    onBtnRechargeClick() {
        Global.UI.openView(RechargePanel);
        Global.UI.closeView(NoticePanel);
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(ActivityTGLJPanel);
    }

    AT_LqxqBtnTouch() {
        Global.UI.openView(ActivityTGLJRecord)
    }

    /**
     * 领红包
     * @param {*} e
     * @param {*} custom
     */
    async onHbClick(e, custom) {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/promot-recharge-redpack/my-redpack-receive", {});
        if (data.code == 200) {
            DefaultToast.instance.showText("领取成功", data.msg);
            this.curCanLQIdx = data.data.effectiveSub;
            this.curHbIdx = data.data.currGiveNum;
            this.packageNum = data.data.redPack;
            this.updateList(data);
            this.updateList(data);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    AT_SaveBtnTouch() {
        if (!GamePlayerManager.instance.player.parentCode || !GamePlayerManager.instance.player.parentId) {
            return Global.UI.openView(InviteCodePanel);
        }
        if (!this.qrurl || this.qrurl == "") return;

        Global.UI.openView(PromotionSharePanel, {
            url: this.qrurl,
            extensionCode: Global.PLAYER.player.inviteCode
        })
    }

    AT_copylinkBtnTouch() {
        let string = this.qrurl
        GameUtils.setClipBordStr(string);
    }

}