import { _decorator, Button, instantiate, Label, Node, Sprite } from "cc";
import { Utils } from "../../../../../Piter.Framework/BaseKit/Util/Utils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { ServerConfig } from "../../../constant/ServerConst";
import { FullScreenView } from "../FullScreenView";
import { NoticeContent } from "./NoticeContent";


const { ccclass, property } = _decorator;

@ccclass('NoticePanel')
export class NoticePanel extends FullScreenView {

    protected static prefabUrl = "notice/prefabs/NoticePanel";

    protected static className = "NoticePanel";

    public noticeList: any[];

    fromtype = "0";
    public createChildren(): void {
        super.createChildren();
        this.getNoticeList();
    }

    public async getNoticeList() {
        let resp = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + "/api/gate/notice-list-by-page", {
            page: 0, pageLength: 9999
        });
        if (resp.code != 200) {
            DefaultAlertView.addOnlyAlert("获取公告失败.");
            return;
        }
        this.noticeList = _.sortBy(resp.data.list, "sortIndex");
        this.showLeftTab();
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_Tab: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_TempNode: Node = null;
    @PiterDirector.AUTO_BIND(Node)
    AT_PageNode: Node;

    showLeftTab() {
        this.AT_Tab.destroyAllChildren();
        for (let i = 0; i < this.noticeList.length; i++) {
            let notice = this.noticeList[i];
            let temp = instantiate(this.AT_TempNode) as Node;
            let titleStr = Utils.getShortName(notice.title, 8)
            temp.getChildByName("title").getComponent(Label).string = titleStr;
            temp.getComponent(Button).clickEvents[0].customEventData = i + "";
            temp.active = true;
            temp.parent = this.AT_Tab;
            if (notice.image) {
                temp.getChildByName("content").getComponent(Label).string = "[图片]";
            } else {
                temp.getChildByName("content").getComponent(Label).string = Utils.getShortName(notice.content, 44);
            }
        }
        // this.showSelectTouch(null, 0)
    }

    public currentIndex: number;
    public showSelectTouch(e, index) {
        if (this.currentIndex == index) {
            return;
        }
        let noticeData = this.noticeList[index];
        if (!noticeData) {
            return;
        }
        Global.UI.openView(NoticeContent, noticeData);
    }

    @PiterDirector.AUTO_BIND(Node)
    AT_TextContent: Node = null;

    @PiterDirector.AUTO_BIND(Label)
    AT_TimeLabel: Label = null;

    @PiterDirector.AUTO_BIND(Label)
    AT_ContentLabel: Label = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_ImageContent: Node = null;

    @PiterDirector.AUTO_BIND(Sprite)
    AT_Image: Sprite = null;

 

    public onSubTabTouch(e, index) {
        this.showSelectTouch(null, Number(index));
    }

    AT_closeBtnTouch(): void {
        Global.UI.closeView(NoticePanel);
    }
}