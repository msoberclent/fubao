import { Label, Node, _decorator, isValid } from 'cc';
import { Utils } from '../../../../../../Piter.Framework/BaseKit/Util/Utils';
import { PiterDirector } from '../../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../../Piter.Framework/PiterGlobal';
import { PiterUI } from '../../../../../../Piter.Framework/UIKit/Base/PiterUI';
import { DefaultToast } from '../../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../../constant/ServerConst';
import { GamePlayerManager } from '../../../../manager/GamePlayerManager';
import { GameUtils } from '../../../../utils/GameUtils';
import { InviteCodePanel } from '../../InviteCodePanel';
import { PromotionLQJLPanel } from '../PromotionLQJLPanel';
import { PromotionSharePanel } from '../share/PromotionSharePanel';
import { GoldUtils } from './../../../../../../Piter.Framework/BaseKit/Util/GoldUtils';
const { ccclass, property } = _decorator;

@ccclass('PromotionTGSMPanel')
export class PromotionTGSMPanel extends PiterUI {

    protected static prefabUrl = "promotion/prefabs/share/tgsmContent";

    protected static className = "PromotionTGSMPanel";

    qrurl: string = "";
    @PiterDirector.AUTO_BIND(Node)
    AT_QRCode: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_linkurl: Node;
    isInit = false;

    @PiterDirector.AUTO_BIND(Node)
    AT_KLQLabel: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_ModeLabel: Node;

    async AT_LingquBtnTouch() {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/gain-reward", { rewardType: 1 }, true);
        if (data.code == 200 && isValid(this.node)) {
            DefaultToast.instance.showText("领取成功!", data.msg);
            this.AT_KLQLabel.getComponent(Label).string = "0.00";
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    AT_LingquRecordBtnTouch() {
        Global.UI.openView(PromotionLQJLPanel);
    }

    createChildren() {
        super.createChildren();
        this.init();
    }

    public async init() {
        if (this.isInit) {
            return
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/my-ext-proxy-info", {}, true);
        if (data.code == 200 && isValid(this.node)) {
            this.showUI();
            this.AT_KLQLabel.getComponent(Label).string = GoldUtils.formatGold(data.data.effectLeft);
            this.AT_ModeLabel.getComponent(Label).string = data.data.proxyMode;
            this.isInit = true;
        } else {
            DefaultToast.instance.showText(data.msg);
        }
        this.showModels();
    }

    respData: any
    public showUI() {
        let code = Global.PLAYER.player.qrCodeUrl;
        if (code && code != "") {
            this.AT_linkurl.getComponent(Label).string = code//Utils.getShortName(respData.qrCodeUrl, 22);
            this.qrurl = code;
            Utils.QRCreate(this.AT_QRCode, code);
        }
    }

    AT_SaveBtnTouch() {
        // if (!GamePlayerManager.instance.player.phone || GamePlayerManager.instance.player.phone == "") {
        //     return Global.UI.openView(BindPhonePanel);
        // }
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

    //1 = 通宝 2 = 极差
    public model: number = 1;

    public showModels() {
        if (this.model == 1) {

        } else if (this.model == 2) {
            this.requestJCFHList();
        }
    }

    //-------------------------------极差分红-------------


    @PiterDirector.AUTO_BIND(Node)
    AT_JCListContent: Node;

    /**
      * 推广说明 
      */
    async requestJCFHList() {
        let data = await Global.HTTP.sendGetRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/extension/query-fanyong-config", {});
        if (data.code == 200) {
            this.showJCFHList(data.data);
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    showJCFHList(data) {
        let list = data.configList;
        list.sort((a, b) => {
            return a.lv - b.lv;
        })
        for (let i = 0; i < list.length; i++) {
            let index = (i + 1);
            let v = this.node.getChildByPath(`contentNode/view/content/tgsm/AT_JCListContent/item${index}`);
            v.active = true;
            v.getChildByName("lvl").getComponent(Label).string = list[i].name;
            v.getChildByName("yeji").getComponent(Label).string = list[i].flow;
            v.getChildByName("ticheng").getComponent(Label).string = list[i].bonus;
        }
    }
}


