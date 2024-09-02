import { Node, ScrollView, Toggle, _decorator, instantiate, v3 } from "cc";

import { isValid } from "cc";
import { BaseEvent } from "../../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { CommonTabItem } from "../../component/CommonTabItem";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { MailDetailPanel } from "./MailDetailPanel";

const { ccclass, property } = _decorator;

@ccclass('MailUI')
export class MailUI extends ScrollToLeftInPanel {
    protected static prefabUrl = "mail/prefabs/MailUI";

    protected static className = "MailUI";
    @PiterDirector.AUTO_BIND(Node)
    AT_content1: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_content2: Node;
    @PiterDirector.AUTO_BIND(Node)
    AT_mailLayout: Node;
    @PiterDirector.AUTO_BIND(MailDetailPanel)
    AT_MailDetailItem: MailDetailPanel;
    @PiterDirector.AUTO_BIND(Node)
    AT_pageItem1: Node;

    // openType = 0;
    defaultOpen = 0;

    public createChildren(): void {
        super.createChildren();
        // Global.SOUND.playEffectPauseMusic(BaseConstant.ONE_DAY_TIME, "back/sound/younjian_btn", 5);
        // this.AT_SafetyLabel.getComponent(Label).string = GoldUtils.formatGold(GamePlayerManager.instance.player.safety);
        this.requestMail();
    }

    init(paramsData: any): void {
        // this.openType = paramsData.openType;
    }

    public onAdded(): void {
        super.onAdded();
    }

    public onRemoved(): void {
        super.onRemoved();
    }

    onBtnSwitchtype(e, custom) {
        if (custom == "0") {
            this.requestMail();
            this.AT_content1.active = true;
            this.AT_content2.active = false;
        } else {
            // this.requestSysMail();
            this.AT_content1.active = false;
            this.AT_content2.active = true;
        }
    }

    async requestMail() {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-list-by-page", { page: 0, pageLength: 9999 }, true);
        if (data.code == 200) {
            if (!isValid(this.node)) {
                return;
            }
            let list = data.data.list;
            if (!list || list.length == 0) {
                this.AT_MailDetailItem.node.active = false;
                this.AT_content1.getChildByName("cm_nodata").active = true;
            }
            this.AT_content2.getComponent(ScrollView).content.destroyAllChildren();
            for (let i = 0; i < list.length; i++) {
                let v = instantiate(this.AT_pageItem1);
                v.active = true;
                v[`info`] = list[i];
                v[`idx`] = i;
                v.setPosition(v3(0, 0));
                v.setParent(this.AT_content2.getComponent(ScrollView).content);
                // let img = list[i].readed ? "mail/youjian_4" : "mail/youjian_3";
                // let red = list[i].readed ? false : true;
                // ImageUtils.showImage(v.getChildByName("readflag").getComponent(Sprite), img);
                // v.getChildByName("redpoint").active = red;
                // v.getChildByName("mailhead").getComponent(Label).string = list[i].mailTitle;
                v.getComponent(CommonTabItem).setText(list[i].mailTitle, 8);
                if (i == 0) {
                    this.onMailDetailClick(list[0]);
                }
                // v.getChildByName("time").getComponent(Label).string = list[i].createStamp;
                // v.getChildByName("content").getComponent(Label).string = Utils.getShortName(list[i].mailDesc, 80);
            }
        }
        // else {
        //     DefaultToast.instance.showText(data.msg);
        // }
    }

    onLeftScClick(e) {
        let node = e.target;
        if (node[`idx`] == this.defaultOpen) {
            node.getComponent(Toggle).isChecked = true;
            return;
        }
        this.onMailDetailClick(node[`info`]);
        this.defaultOpen = node[`idx`];
    }

    // async requestSysMail() {
    //     let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/notice-list-by-page", { page: 0, pageLength: 9999 });
    //     if (data.code == 200) {
    //         let list = data.data.list;
    //         if (!list || list.length == 0) {
    //             this.AT_content2.getChildByName("cm_nodata").active = true;
    //         }
    //         this.AT_sysLayout.destroyAllChildren();
    //         for (let i = 0; i < list.length; i++) {
    //             let v = instantiate(this.AT_sysItem);
    //             v.active = true;
    //             v[`info`] = list[i];
    //             v.setPosition(v3(0, 0));
    //             v.setParent(this.AT_sysLayout);
    //             let img = list[i].readed ? "mail/youjian_4" : "mail/youjian_3";
    //             let red = list[i].readed ? false : true;
    //             ImageUtils.showImage(v.getChildByName("readflag").getComponent(Sprite), img);
    //             v.getChildByName("redpoint").active = red;
    //             v.getChildByName("mailhead").getComponent(Label).string = list[i].title;
    //             v.getChildByName("time").getComponent(Label).string = list[i].createStamp;
    //             if (list[i].content) {
    //                 v.getChildByName("content").getComponent(Label).string = list[i].content;
    //             } else {
    //                 v.getChildByName("content").getComponent(Label).string = "图片";
    //             }
    //             // Utils.getShortName(list[i].mailDesc, 80);
    //         }
    //     } else {
    //         DefaultToast.instance.showText(data.msg);
    //     }
    // }

    /**
     * 点击阅读邮件
     */
    async onMailDetailClick(info) {
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-read", { mailId: info.id })
        if (data.code == 200) {

            if (!info.readed) {
                GamePlayerManager.instance.redDotMap[`MAIL`] -= 1;
                Global.EVENT.dispatchEvent(BaseEvent.RED_DOT_FLUSH, GamePlayerManager.instance.redDotMap);
            }
            this.AT_MailDetailItem.init({ openType: "mail", data: info, father: this })
            // Global.UI.openView(MailDetailPanel, { openType: "mail", data: node[`info`], father: this })
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    // async onSysMailDetailClick(e) {
    //     let node = e.target;
    //     let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/notice-read", { noticeId: node[`info`].id })
    //     if (data.code == 200) {
    //         if (!node[`info`].readed) {
    //             GamePlayerManager.instance.redDotMap[`NOTICE`] -= 1;
    //             Global.EVENT.dispatchEvent(BaseEvent.RED_DOT_FLUSH, GamePlayerManager.instance.redDotMap);
    //         }
    //         // Global.UI.openView(MailDetailPanel, { openType: "sys", data: node[`info`], father: this })
    //     } else {
    //         DefaultToast.instance.showText(data.msg);
    //     }
    // }

    AT_closeBtnTouch() {
        Global.UI.closeView(MailUI);
    }
}