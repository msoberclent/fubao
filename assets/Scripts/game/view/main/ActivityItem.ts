import { Component, Label, Sprite, _decorator } from "cc";
import { TimeUtils } from "../../../../Piter.Framework/BaseKit/Util/TimeUtils";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { ImageUtils } from "../../../../Piter.Framework/UIKit/Util/ImageUtils";
import { ActivityDetailPanel } from "./ActivityDetailPanel";

const { ccclass, property } = _decorator;

@ccclass('ActivityItem')
export class ActivityItem extends Component {
    itemData: any
    public updateItem(itemData, index) {
        this.node[`data`] = itemData;
        ImageUtils.showRemoteHeader(this.node.getComponent(Sprite), itemData.titleImage);
        this.node.getChildByName("time").getComponent(Label).string = TimeUtils.dateFormatMS("yyyy-MM-dd", new Date(itemData.createStamp).getTime());
    }

    /**
     * updateItem2
     */
    public updateItem2(itemData) {
        this.itemData = itemData;
        ImageUtils.showRemoteHeader(this.node.getComponent(Sprite), itemData.titleImage);
    }

    public onItemTouch() {
        Global.UI.openView(ActivityDetailPanel, this.itemData);
    }
}