import { Component, Label, RichText, Sprite, _decorator } from "cc";
import { ImageUtils } from "../../../../../Piter.Framework/UIKit/Util/ImageUtils";

const { ccclass, property } = _decorator;

@ccclass('VIPItem')
export class VIPItem extends Component {

    curlvl = null;
    curflow = null;
    curstore = null;

    public updateItem(itemData, index) {
        this.node[`idx`] = index;
        if (this.curlvl >= itemData.vipLevel) {
            ImageUtils.showImage(this.node.getChildByName("vip_render_lock").getComponent(Sprite), "vip/res/vip_render_unlock");
            this.node.getChildByName("desc").getComponent(RichText).string = `<color=#ffffff>您需要</color><color=#ffcec3>${0}</color><color=#ffffff>存款和</color>
            <color=#ffcec3>${0}</color><color=#ffffff>流水升级至VIP${itemData.vipLevel}</color>`;
        } else {
            ImageUtils.showImage(this.node.getChildByName("vip_render_lock").getComponent(Sprite), "vip/res/vip_render_lock");
            this.node.getChildByName("desc").getComponent(RichText).string = `<color=#ffffff>您需要</color><color=#ffcec3>${itemData.topup.split(",")[1] - this.curstore}</color><color=#ffffff>存款和</color>\n<color=#ffcec3>${itemData.flow.split(",")[1] - this.curflow}</color><color=#ffffff>流水升级至VIP${itemData.vipLevel}</color>`;
        }
        this.node.getChildByName("viplvl").getComponent(Label).string = "VIP" + itemData.vipLevel;
        this.node.getChildByName("liushui").getComponent(Label).string = itemData.relegationFlow;
    }

    setParam(lvl, flow, store) {
        this.curflow = flow;
        this.curlvl = lvl;
        this.curstore = store;
    }
}