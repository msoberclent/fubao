import { Label, Node, PageView, ProgressBar, RichText, Sprite, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { UIResConfig } from "../../../../../Piter.Framework/UIKit/Base/PiterView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import ButtonUtils from "../../../../../Piter.Framework/UIKit/Util/ButtonUtils";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { BundlesInfo } from "../../../../bundles";
import { MainDirConst } from "../../../constant/GameResConst";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { FullScreenView } from "../FullScreenView";
import { VIPDetailPanel } from "./VIPDetailPanel";
import { VIPItem } from "./VIPItem";

const { ccclass, property } = _decorator;
@ccclass('VIPPanel')
export class VIPPanel extends FullScreenView {
    protected static prefabUrl = "vip/prefabs/VIPPanel";

    protected static className = "VIPPanel";

    protected static uiResConfig: UIResConfig = {
        bundleName: BundlesInfo.game_main,
        dirNames: [MainDirConst.vip]
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_curlLvl: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_nextLvl: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_nameLbel: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_vipLevel: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_PrograssCun: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_PrograssBet: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_HeaderImage: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_vipListItem: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_VipTequan: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Lijin: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Tixian: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Tikuan: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_VipFuli: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_LeiJiLabel: Node;


    @PiterDirector.AUTO_BIND(Node)
    AT_Jinji: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_JinjiBtn: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Hongbao: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_HongbaoBtn: Node;

    @PiterDirector.AUTO_BIND(Label)
    public AT_SafetyLabel: Label;

    curLevel = null;
    curflow = null;
    curstore = null;

    selectVipLevel = 0;
    vipCfg = [];
    giftCfg = [];
    public createChildren(): void {
        super.createChildren();
        this.requestVipInfo();
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    initUI() {
        this.AT_nameLbel.getComponent(Label).string = GamePlayerManager.instance.player.simpleUser.nick;
        ImageUtils.showRemoteHeader(this.AT_HeaderImage.getComponent(Sprite), GamePlayerManager.instance.player.simpleUser.headImg);
        this.AT_vipLevel.getComponent(Label).string = "VIP" + GamePlayerManager.instance.player.vip;
        if (this.curLevel >= this.vipCfg.length) {
            this.AT_PrograssBet.getComponent(ProgressBar).progress = this.AT_PrograssCun.getComponent(ProgressBar).progress = 1;
        } else {
            this.AT_PrograssBet.getComponent(ProgressBar).progress = this.curflow / this.vipCfg[this.curLevel].flow.split(",")[1];
            this.AT_PrograssCun.getComponent(ProgressBar).progress = this.curstore / this.vipCfg[this.curLevel].topup.split(",")[1];
        }

    }

    async requestVipInfo() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/vip-list", {});
        if (resp.code != 200) {
            return DefaultToast.instance.showText(resp.msg);
        } else {
            this.curLevel = resp.data.vipLv;
            this.curflow = resp.data.allFlow;
            this.curstore = resp.data.allTopUp;
            resp.data.list && resp.data.list.shift();
            resp.data.relationArr && resp.data.relationArr.shift();
            this.vipCfg = resp.data.list;
            this.giftCfg = resp.data.relationArr;
            //模拟数据
            // if (!this.giftCfg) {
            //     this.giftCfg = [{ "vip_level": 1, "gift_state": 1, "red_state": 0 },
            //     { "vip_level": 2, "gift_state": 1, "red_state": 0 },
            //     { "vip_level": 3, "gift_state": 0, "red_state": 0 },
            //     { "vip_level": 4, "gift_state": 0, "red_state": 0 },
            //     { "vip_level": 5, "gift_state": 0, "red_state": 0 },
            //     { "vip_level": 6, "gift_state": 0, "red_state": 0 },
            //     { "vip_level": 7, "gift_state": 0, "red_state": 0 },
            //     { "vip_level": 8, "gift_state": 0, "red_state": 0 },
            //     { "vip_level": 9, "gift_state": 0, "red_state": 0 },
            //     { "vip_level": 10, "gift_state": 0, "red_state": 0 },
            //     ];
            // }
            this.AT_curlLvl.getComponent(Label).string = "VIP" + this.curLevel;
            this.AT_nextLvl.getComponent(Label).string = "VIP" + (this.curLevel + 1);
            this.AT_LeiJiLabel.getComponent(RichText).string = `<color=#000000>您以累计完成</color><color=#ea4e3d> ${GoldUtils.formatGold(resp.data.allTopUp)} </color><color=#000000>存款和</color><color=#ea4e3d> ${GoldUtils.formatGold(resp.data.allFlow)} </color><color=#000000>流水</color>`
            this.initVipScroller();
            this.initUI();
        }
    }

    initVipScroller() {
        for (let i = 0; i < this.vipCfg.length; i++) {
            let v = this.node.getChildByPath("contentNode/view/content/mid/view/layout").children[i];
            let itemData = this.vipCfg[i];
            v.getComponent(VIPItem).setParam(this.curLevel, this.curflow, this.curstore);
            v.getComponent(VIPItem).updateItem(itemData, i);
            v.active = true;
        }
        this.initBenift(0);
    }

    onListPageChange(e: PageView) {
        this.initBenift(e.curPageIdx);
    }

    initBenift(curPage) {
        this.selectVipLevel = curPage + 1;
        let levcfg = this.vipCfg[curPage];
        let ext = JSON.parse(levcfg.vipExt);
        this.AT_VipTequan.getComponent(Label).string = "VIP" + (curPage + 1) + "特权";
        this.AT_VipFuli.getComponent(Label).string = "VIP" + (curPage + 1) + "福利";
        this.AT_Lijin.getComponent(Label).string = ext.dayGiftMoney + "元";
        this.AT_Tixian.getComponent(Label).string = ext.withdrawAll + "元";
        this.AT_Tikuan.getComponent(Label).string = ext.withdrawTimes + "次";

        this.AT_Jinji.getComponent(Label).string = ext.upGiftMoney + "元";
        this.AT_Hongbao.getComponent(Label).string = ext.redMoney + "元";

        if (this.curLevel < curPage + 1) {
            ButtonUtils.setGray(this.AT_JinjiBtn.getComponent(Sprite), true);
            ButtonUtils.setGray(this.AT_HongbaoBtn.getComponent(Sprite), true);
        } else {
            let ext = this.giftCfg[curPage];
            if (ext.gift_state == 1) {
                ButtonUtils.setGray(this.AT_JinjiBtn.getComponent(Sprite), true);
            } else {
                ButtonUtils.setGray(this.AT_JinjiBtn.getComponent(Sprite), false);
            }

            if (ext.red_state == 1) {
                ButtonUtils.setGray(this.AT_HongbaoBtn.getComponent(Sprite), true);
            } else {
                ButtonUtils.setGray(this.AT_HongbaoBtn.getComponent(Sprite), false);
            }
        }

    }

    //晋级礼金领取
    async AT_JinjiBtnTouch() {
        let uid = GamePlayerManager.instance.player.simpleUser.uid;
        let vipLv = this.selectVipLevel;
        let type = 1;
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/vip-receive", { uid: uid, vipLv: vipLv, receiveType: type });
        if (resp.code == 200) {
            ButtonUtils.setGray(this.AT_JinjiBtn.getComponent(Sprite), true);
            this.giftCfg[vipLv - 1].gift_state = 1;
            DefaultToast.instance.showText("领取成功");
        } else {
            return DefaultToast.instance.showText(resp.msg);
        }
    }

    //红包领取
    async AT_HongbaoBtnTouch() {
        let uid = GamePlayerManager.instance.player.simpleUser.uid;
        let vipLv = this.selectVipLevel;
        let type = 2;
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/vip-receive", { uid: uid, vipLv: vipLv, receiveType: type });
        if (resp.code == 200) {
            ButtonUtils.setGray(this.AT_HongbaoBtn.getComponent(Sprite), true);
            this.giftCfg[vipLv - 1].red_state = 1;
            DefaultToast.instance.showText("领取成功");
        } else {
            return DefaultToast.instance.showText(resp.msg);
        }
    }

    AT_VipDetailBtnTouch() {
        Global.UI.openView(VIPDetailPanel, this);
    }

    AT_BackBtnTouch() {
        Global.UI.closeView(VIPPanel);
    }
}