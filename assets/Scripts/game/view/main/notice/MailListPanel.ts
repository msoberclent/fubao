import { Node, _decorator, instantiate } from "cc";

import { EventTouch, isValid } from "cc";
import { BaseEvent } from "../../../../../Piter.Framework/BaseKit/Constant/BaseEvent";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultToast } from "../../../../../Piter.Framework/UIKit/Example/DefaultToast";
import { ServerConfig } from "../../../constant/ServerConst";
import { GamePlayerManager } from "../../../manager/GamePlayerManager";
import { ScrollToLeftInPanel } from "../../panel/ScrollToLeftInPanel";
import { MailDetailPanel } from "./MailDetailPanel";
import { MailListItem } from "./MailListItem";

const { ccclass, property } = _decorator;

@ccclass('MailListPanel')
export class MailListPanel extends ScrollToLeftInPanel {
    protected static prefabUrl = "mail/prefabs/MailListPanel";

    protected static className = "MailListPanel";
    @PiterDirector.AUTO_BIND(Node)
    AT_NoRecord: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_MailSc: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Layout: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_Item: Node;

    public createChildren(): void {
        super.createChildren();
        this.requestMail();
    }

    async requestMail() {
        this.AT_Layout.destroyAllChildren();
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-list-by-page", { page: 0, pageLength: 9999 });
        if (data.code == 200) {
            if (!isValid(this.node)) {
                return;
            }
            let list = data.data.list;
            this.AT_NoRecord.active = list.length == 0;
            for (let i = 0; i < list.length; i++) {
                let v = instantiate(this.AT_Item);
                v.active = true;
                v.getComponent(MailListItem).setItemData(list[i], i);
                v.parent = this.AT_Layout
            }
        }
    }


    showMailDetailInfo(mailItem: MailListItem) {
        Global.UI.openView(MailDetailPanel, {
            itemData: mailItem.itemData,
            delegate: this
        })
    }


    /**
     * 点击阅读邮件
     */
    async onMailDetailClick(e: EventTouch, custorm) {
        let node = e.target as Node;
        let itemData = node.getComponent(MailListItem).itemData;
        if (itemData.readed == 1) {
            this.showMailDetailInfo(node.getComponent(MailListItem));
            return;
        }
        let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/mail-read", { mailId: itemData.id })
        if (data.code == 200) {
            if (!itemData.readed) {
                GamePlayerManager.instance.redDotMap[`MAIL`] -= 1;
                Global.EVENT.dispatchEvent(BaseEvent.RED_DOT_FLUSH, GamePlayerManager.instance.redDotMap);
            }
            itemData.readed = 1;
            node.getComponent(MailListItem).flushUI();
            this.showMailDetailInfo(node.getComponent(MailListItem));
        } else {
            DefaultToast.instance.showText(data.msg);
        }
    }

    AT_closeBtnTouch() {
        Global.UI.closeView(MailListPanel);
    }
}