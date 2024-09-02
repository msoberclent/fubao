import { Component, Node, PageView, Sprite, SpriteFrame, _decorator, instantiate, macro, v3 } from "cc";
import Global from "../../../Piter.Framework/PiterGlobal";
import { ImageUtils } from "../../../Piter.Framework/UIKit/Util/ImageUtils";

const { ccclass, property } = _decorator;

@ccclass('GameScrolBanner')
export class GameScrolBanner extends Component {
    @property(PageView)
    pageview: PageView = null;

    // @property({
    //     type: [SpriteFrame]
    // })
    // spriteFrames: SpriteFrame[] = [];

    @property(Node)
    item: Node = null;

    currentPage: number = 0;

    public spriteFrameUrls: string[] = [];

    onLoad() {
        this.spriteFrameUrls = Global.PLAYER.bannerUrls;
        this.initPageView();
        this._startCount();
    }

    initPageView() {
        this.pageview.content.destroyAllChildren();
        if (this.spriteFrameUrls && this.spriteFrameUrls.length > 0) {
            for (let i = 0; i < this.spriteFrameUrls.length; i++) {
                let v = instantiate(this.item);
                // v.getComponentInChildren(Sprite).spriteFrame = this.spriteFrames[i];
                ImageUtils.loadRemoteImage(v.getComponentInChildren(Sprite), this.spriteFrameUrls[i]);
                v.setParent(this.pageview.content);
                v.setPosition(v3(0, 0));
                v.active = true;
            }
        }
    }

    _startCount() {
        this.schedule(this.changePage, 5, macro.REPEAT_FOREVER, 5);
    }

    onPageChangeEnd(e) {
        this.unscheduleAllCallbacks();
        this.currentPage = this.pageview.curPageIdx;
        this._startCount();
    }

    changePage() {
        if (this.pageview.content.children.length == 0) return;
        this.currentPage += 1;
        if (this.currentPage >= this.pageview.content.children.length) {
            this.currentPage = 0;
        }
        this.pageview.setCurrentPageIndex(this.currentPage);
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
    }
}
