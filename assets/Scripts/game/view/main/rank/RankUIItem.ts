import { Component, Label, Sprite, _decorator } from "cc";
import { GoldUtils } from "../../../../../Piter.Framework/BaseKit/Util/GoldUtils";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";

const { ccclass, property } = _decorator;
@ccclass('RankUIItem')
export class RankUIItem extends Component {

    updateItem(data, index) {
        if (data.rank <= 3) {
            ImageUtils.showImage(this.node.getChildByName("rankImg").getComponent(Sprite), "notice/res/rank_pm_" + data.rank);
            this.node.getChildByName("rankImg").active = true;
            this.node.getChildByName("rankTxt").active = false;
        } else {
            this.node.getChildByName("rankImg").active = false;
            this.node.getChildByName("rankTxt").active = true;
            this.node.getChildByName("rankTxt").getComponent(Label).string = data.rank;
        }

        ImageUtils.showRemoteHeader(this.node.getChildByName("head").getComponent(Sprite), data.avatar);
        this.node.getChildByName("name").getComponent(Label).string = data.nick;
        this.node.getChildByName("id").getComponent(Label).string = data.uid;
        this.node.getChildByName("yingliNode").getChildByName("yingli").getComponent(Label).string = GoldUtils.formatGold(data.win);
        this.node.getChildByName("jiangjinNode").getChildByName("jiangjin").getComponent(Label).string = GoldUtils.formatGold(data.prize);
    }
} 