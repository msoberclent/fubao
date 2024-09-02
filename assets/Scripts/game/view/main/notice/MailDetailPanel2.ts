import { Label, Node, Sprite, _decorator, instantiate } from "cc";

import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { PiterUI } from "../../../../../Piter.Framework/UIKit/Base/PiterUI";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ServerConfig } from "../../../constant/ServerConst";
import { MailUI } from "./MailUI";

const { ccclass, property } = _decorator;

@ccclass('MailDetailPanel2')
export class MailDetailPanel2 extends PiterUI {
    // protected static prefabUrl = "mail/prefabs/MailDetailPanel";

    // protected static className = "MailDetailPanel";
    @property(Node)
    AT_maillayoutitem: Node = null;;
    @property(Node)
    AT_reciveBtn: Node = null;
    @property(Node)
    AT_deleteBtn: Node = null;
    @property(Node)
    AT_fujianItem: Node = null;
    @property(Node)
    AT_fujianLayout: Node = null;

    openType = "mail";
    data = null;
    father: MailUI = null;

    public onLoad(): void {
    }
    createChildren() {
        super.createChildren();
    }

    init(paramsData: any): void {
        this.openType = paramsData.openType;
        this.data = paramsData.data;
        this.father = paramsData.father;
        this.AT_maillayoutitem.active = true;
        this.initUI();
    }

    initUI() {
        if (this.openType == "mail") {
            if (!this.data.rewarded && (this.data.mailAddDiamond || this.data.mailAddGold)) {
                this.AT_reciveBtn.active = true;
            } else {
                this.AT_reciveBtn.active = false;
            }
            this.initMail();
        }
        if (this.openType == "sys") {
            this.AT_maillayoutitem.getChildByName("reciveGroup").active = false;
            this.initSys();
        }
    }

    initMail() {
        this.AT_maillayoutitem.getChildByName("title").getComponent(Label).string = this.data.mailTitle;
        this.AT_maillayoutitem.getChildByName("time").getComponent(Label).string = this.data.mailSenderName + "发送于" + this.data.createStamp;
        this.AT_maillayoutitem.getChildByName("content").getComponent(Label).string = this.data.mailDesc;
        let fujianarr = [];
        if (this.data.mailAddDiamond) {
            fujianarr.push({ cnt: this.data.mailAddDiamond })
        } if (this.data.mailAddGold) {
            fujianarr.push({ cnt: this.data.mailAddGold })
        }
        this.AT_fujianLayout.destroyAllChildren();
        if (fujianarr.length > 0) {
            this.AT_maillayoutitem.getChildByName("fujian").active = true;
            this.AT_maillayoutitem.getChildByName("AT_fujianLayout").active = true;
        } else {
            this.AT_maillayoutitem.getChildByName("fujian").active = false;
            this.AT_maillayoutitem.getChildByName("AT_fujianLayout").active = false;
        }
        for (let i = 0; i < fujianarr.length; i++) {
            let v = instantiate(this.AT_fujianItem);
            // let img = this.data.rewarded ? "mail/youjian_9" : "mail/youjian_25";
            // ImageUtils.showImage(v.getComponent(Sprite), img);
            v.getComponentInChildren(Label).string = GoldUtils.formatGold(fujianarr[i].cnt);
            v.active = true;
            v.setParent(this.AT_fujianLayout);
        }
        this.AT_deleteBtn.active = true;
    }

    initSys() {
        this.AT_maillayoutitem.getChildByName("title").getComponent(Label).string = this.data.title;
        this.AT_maillayoutitem.getChildByName("time").getComponent(Label).string = this.data.operator + "发送于" + this.data.createStamp;
        if (this.data.content) {
            this.AT_maillayoutitem.getChildByName("content").active = true;
            this.AT_maillayoutitem.getChildByName("contentImg").active = false;
            this.AT_maillayoutitem.getChildByName("content").getComponent(Label).string = this.data.content;
        } else {
            this.AT_maillayoutitem.getChildByName("content").active = false;
            this.AT_maillayoutitem.getChildByName("contentImg").active = true;
            ImageUtils.showRemoteHeader(this.AT_maillayoutitem.getChildByName("contentImg").getComponent(Sprite), this.data.image);
        }
    }

    async AT_reciveBtnTouch() {
        let mailId = this.data.id;
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-reward", { mailId: mailId });
        if (data.code != 200) {
            DefaultToast.instance.showText(data.msg);
        } else {
            DefaultToast.instance.showText("领取成功", data.msg);
            this.AT_reciveBtn.active = false;
            // if (this.father.openType == 0) {
            this.father.requestMail()
            // } else {
            // this.father.requestSysMail();
            // }
        }
    }

    AT_deleteBtnTouch() {
        let _this = this;
        DefaultAlertView.addAlert("确认要删除该邮件吗?", this.deleteMailConfim.bind(_this), null, false);
    }

    async deleteMailConfim() {
        let mailId = this.data.id;
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-del", { mailId: mailId });
        if (data.code != 200) {
            DefaultToast.instance.showText(data.msg);
        } else {
            DefaultToast.instance.showText("删除成功", data.msg);
            // if (this.father.openType == 0) {
            this.father.requestMail()
            // } else {
            // this.father.requestSysMail();
            // }
        }
    }
}