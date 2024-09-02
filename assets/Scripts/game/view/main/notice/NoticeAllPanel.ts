import { _decorator, instantiate, Label, Node, ScrollView, Sprite, Toggle } from "cc";
import { Utils } from "../../../../../Piter.Framework/BaseKit/Util/Utils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ServerConfig } from "../../../constant/ServerConst";
import { CommonTabItem } from "../../component/CommonTabItem";
import { ActivityPanel } from "../ActivityPanel";
import { FullScreenView } from "../FullScreenView";
import { RankUI } from "../rank/RankUI";


const { ccclass, property } = _decorator;

@ccclass('NoticeAllPanel')
export class NoticeAllPanel extends FullScreenView {

    protected static prefabUrl = "notice/prefabs/NoticeAllPanel";

    protected static className = "NoticeAllPanel";

    public noticeList: any[];

    fromtype = "0";
    public createChildren(): void {
        super.createChildren();
        if (this.fromtype == "0") {
            this.AT_PageNode.getChildByName("huodong").getComponent(Toggle).isChecked = true;
            this.onPageSwitchTouch(null, this.fromtype);
        } else if (this.fromtype == "1") {
            this.AT_PageNode.getChildByName("gonggao").getComponent(Toggle).isChecked = true;
            this.onPageSwitchTouch(null, this.fromtype);
            // this.getNoticeList();
        } else if (this.fromtype == "2") {
            this.AT_PageNode.getChildByName("paihangbang").getComponent(Toggle).isChecked = true;
            this.onPageSwitchTouch(null, this.fromtype);
        } else {
            this.AT_PageNode.getChildByName("huodong").getComponent(Toggle).isChecked = true;
            this.onPageSwitchTouch(null, this.fromtype);
        }
    }

    init(param) {
        if (param && param.type) {
            this.fromtype = param.type;
        }
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
    AT_HDContent: Node = null;
    @PiterDirector.AUTO_BIND(Node)
    AT_GGContent: Node = null;
    @PiterDirector.AUTO_BIND(Node)
    AT_PHBContent: Node = null;
    @PiterDirector.AUTO_BIND(Node)
    AT_PageNode: Node;

    showLeftTab() {
        this.AT_Tab.removeAllChildren();
        for (let i = 0; i < this.noticeList.length; i++) {
            let notice = this.noticeList[i];
            let temp = instantiate(this.AT_TempNode) as Node;
            let titleStr = Utils.getShortName(notice.title, 8)
            temp.getComponent(CommonTabItem).setText(titleStr);
            // temp.getChildByName("tab1").getComponent(Label).string = titleStr;
            // temp.getChildByPath("select/tab2").getComponent(Label).string = titleStr;
            temp.getComponent(Toggle).clickEvents[0].customEventData = i + "";
            temp.active = true;
            temp.parent = this.AT_Tab
        }
        this.showSelectTouch(null, 0)
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
        if (noticeData.image) {
            this.showImageNotice(noticeData);
        } else {
            this.showTextNotice(noticeData);
        }
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

    private showImageNotice(noticeData) {
        this.AT_ImageContent.active = true;
        this.AT_TextContent.active = false;
        this.AT_Image.spriteFrame = null;
        this.AT_ImageContent.getComponent(ScrollView).scrollToTop(0.01);
        ImageUtils.loadRemoteImage(this.AT_Image, noticeData.image);
    }

    private showTextNotice(noticeData) {
        this.AT_ImageContent.active = false;
        this.AT_TextContent.active = true;
        this.AT_ContentLabel.string = noticeData.content;
        this.AT_TimeLabel.string = noticeData.operator + "发布于: " + noticeData.createStamp;
    }

    public onSubTabTouch(e, index) {
        this.showSelectTouch(null, Number(index));
    }

    AT_closeBtnTouch(): void {
        Global.UI.closeView(NoticeAllPanel);
    }

    onPageSwitchTouch(e, custom) {
        this.AT_PHBContent.active = this.AT_HDContent.active = this.AT_GGContent.active = false;
        switch (custom) {
            case "0":
                this.AT_HDContent.active = true;
                this.AT_HDContent.getComponent(ActivityPanel).requestActivity();
                break;
            case "1":
                this.AT_GGContent.active = true;
                this.getNoticeList();
                break;
            case "2":
                this.AT_PHBContent.active = true;
                this.AT_PHBContent.getComponent(RankUI).requestRank("0");
        }
    }
}