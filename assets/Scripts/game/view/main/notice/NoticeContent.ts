import { _decorator, Label, Node, ScrollView, Sprite } from "cc";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { FullScreenView } from "../FullScreenView";


const { ccclass, property } = _decorator;

@ccclass('NoticeContent')
export class NoticeContent extends FullScreenView {

    protected static prefabUrl = "notice/prefabs/ggcontent";

    protected static className = "NoticeContent";

    noticeData = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_TitleLabel: Node = null;

    @PiterDirector.AUTO_BIND(Node)
    AT_TitleLabel2: Node = null;


    public createChildren(): void {
        super.createChildren();
        this.initUI();
    }

    init(param) {
        this.noticeData = param;
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

    initUI() {
        if (this.noticeData.image) {
            this.showImageNotice(this.noticeData);
        } else {
            this.showTextNotice(this.noticeData);
        }
    }

    private showImageNotice(noticeData) {
        this.AT_ImageContent.active = true;
        this.AT_TextContent.active = false;
        this.AT_Image.spriteFrame = null;
        this.AT_ImageContent.getComponent(ScrollView).scrollToTop(0.01);
        ImageUtils.loadRemoteImage(this.AT_Image, noticeData.image, false);
        this.AT_TitleLabel2.getComponent(Label).string = noticeData.title;
    }

    private showTextNotice(noticeData) {
        this.AT_ImageContent.active = false;
        this.AT_TextContent.active = true;
        this.AT_ContentLabel.string = noticeData.content;
        this.AT_TimeLabel.string = noticeData.operator + "发布于: " + noticeData.createStamp;
        this.AT_TitleLabel.getComponent(Label).string = noticeData.title;
    }

    AT_closeDetailBtnTouch() {
        Global.UI.closeView(NoticeContent)
    }


}