import { Label, Node, ScrollView, _decorator, instantiate, v3 } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { MailListPanel } from "./MailListPanel";

const { ccclass, property } = _decorator;

@ccclass('MailDetailPanel')
export class MailDetailPanel extends ScrollToLeftInPanel {

    protected static prefabUrl = "mail/prefabs/MailDetailPanel";

    protected static className = "MailDetailPanel";

    @PiterDirector.AUTO_BIND(Node)
    AT_reciveBtn: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_deleteBtn: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_ImageSc: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_LabelSc: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_TimeLabel: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_TitleLabel: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_FujianText: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_FujianLayout: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_fujianItem: Node = null;

    mailData = null;

    delegate: MailListPanel = null;

    AT_closeBtnTouch() {
        Global.UI.closeView(MailDetailPanel);
    }

    createChildren() {
        super.createChildren();
        this.mailData = this.paramsData.itemData;
        this.delegate = this.paramsData.delegate;
        this.showMailInfo();
    }

    public showMailInfo() {
        this.AT_TimeLabel.getComponent(Label).string = this.mailData.mailSenderName + "发送于" + this.mailData.createStamp;
        this.AT_TitleLabel.getComponent(Label).string = this.mailData.mailTitle;
        this.AT_LabelSc.active = true;
        this.AT_LabelSc.getComponent(ScrollView).content.getChildByName("text").getComponent(Label).string = this.mailData.mailDesc;
        this.initInitFuJian();
    }

    initInitFuJian() {
        if (!this.mailData.rewarded && (this.mailData.mailAddDiamond || this.mailData.mailAddGold)) {
            this.AT_reciveBtn.active = true;
        } else {
            this.AT_reciveBtn.active = false;
        }

        let fujianarr = [];
        if (this.mailData.mailAddDiamond) {
            fujianarr.push({ cnt: this.mailData.mailAddDiamond })
        } if (this.mailData.mailAddGold) {
            fujianarr.push({ cnt: this.mailData.mailAddGold })
        }
        this.AT_FujianLayout.active = this.AT_FujianText.active = fujianarr.length > 0;
        for (let i = 0; i < fujianarr.length; i++) {
            let v = instantiate(this.AT_fujianItem);
            v.getChildByName("cnt").getComponent(Label).string = GoldUtils.formatGold(fujianarr[i].cnt);
            v.active = true;
            v.position = v3(0, 0, 0);
            v.parent = this.AT_FujianLayout
        }
        this.AT_deleteBtn.active = true;
    }

    async AT_reciveBtnTouch() {
        let mailId = this.mailData.id;
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-reward", { mailId: mailId });
        if (data.code != 200) {
            DefaultToast.instance.showText(data.msg);
        } else {
            DefaultToast.instance.showText("领取成功", data.msg);
            this.AT_reciveBtn.active = false;
            this.delegate.requestMail()
        }
    }

    AT_deleteBtnTouch() {
        let _this = this;
        DefaultAlertView.addAlert("确认要删除该邮件吗?", this.deleteMailConfim.bind(_this), null, false);
    }

    async deleteMailConfim() {
        let mailId = this.mailData.id;
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-del", { mailId: mailId });
        if (data.code != 200) {
            DefaultToast.instance.showText(data.msg);
        } else {
            DefaultToast.instance.showText("删除成功", data.msg);
            this.delegate.requestMail()
            this.AT_closeBtnTouch();
        }
    }
}